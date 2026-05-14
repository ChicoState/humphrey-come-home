from django.core.management.base import BaseCommand
from shelters.models import Animal

import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin


BASE_URL = "http://www.chicoanimalshelter.org/"
PAGE_URL = urljoin(BASE_URL, "stray-animals.html")


def parse_fields(paragraph_text):
    fields = [
        "Intake Date",
        "Breed",
        "Color",
        "Sex",
        "Age",
        "Note",
        "Location",
    ]

    record = {}

    for i, field in enumerate(fields):
        start_pattern = rf"{re.escape(field)}:\s*"
        start_match = re.search(start_pattern, paragraph_text)
        if not start_match:
            record[field] = ""
            continue

        start_index = start_match.end()

        end_index = len(paragraph_text)
        for next_field in fields[i + 1:]:
            next_match = re.search(rf"{re.escape(next_field)}:\s*", paragraph_text[start_index:])
            if next_match:
                possible_end = start_index + next_match.start()
                if possible_end < end_index:
                    end_index = possible_end

        value = paragraph_text[start_index:end_index].strip()
        value = re.sub(r"\s+", " ", value)
        record[field] = value

    return record


class Command(BaseCommand):
    help = "Scrape Chico Animal Shelter stray animals and save to database"

    def handle(self, *args, **kwargs):
        try:
            response = requests.get(PAGE_URL, timeout=20)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, "html.parser")

            titles = soup.find_all("h2", class_="wsite-content-title")
            all_images = soup.find_all("img")

            created_count = 0
            updated_count = 0
            skipped_count = 0

            for title in titles:
                animal_id = title.get_text(" ", strip=True)
                if not animal_id:
                    skipped_count += 1
                    continue

                paragraph = None
                node = title.find_next()

                while node:
                    if getattr(node, "name", None) == "h2" and "wsite-content-title" in (node.get("class") or []):
                        break

                    if getattr(node, "name", None) == "div" and "paragraph" in (node.get("class") or []):
                        text = node.get_text(" ", strip=True)
                        if "Intake Date:" in text:
                            paragraph = node
                            break

                    node = node.find_next()

                if not paragraph:
                    skipped_count += 1
                    self.stdout.write(self.style.WARNING(f"Skipped {animal_id}: no matching paragraph found"))
                    continue

                paragraph_text = paragraph.get_text(" ", strip=True)
                parsed = parse_fields(paragraph_text)

                photo_url = ""
                for img in all_images:
                    src = img.get("src", "")
                    if animal_id in src:
                        photo_url = urljoin(BASE_URL, src)
                        break

                obj, created = Animal.objects.update_or_create(
                    animal_id=animal_id,
                    defaults={
                        "intake_date": parsed.get("Intake Date", ""),
                        "breed": parsed.get("Breed", ""),
                        "color": parsed.get("Color", ""),
                        "sex": parsed.get("Sex", ""),
                        "age": parsed.get("Age", ""),
                        "note": parsed.get("Note", ""),
                        "location": parsed.get("Location", ""),
                        "source_url": PAGE_URL,
                        "shelter_location": "(39.713089, -121.837478)",
                        "photo": photo_url,
                    },
                )

                if created:
                    created_count += 1
                else:
                    updated_count += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f"Scrape complete. Created {created_count}, updated {updated_count}, skipped {skipped_count}."
                )
            )

        except requests.exceptions.RequestException as e:
            self.stdout.write(self.style.ERROR(f"Error fetching the webpage: {e}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error parsing the webpage: {e}"))