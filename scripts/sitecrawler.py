import requests, os, sys
from dotenv import load_dotenv
from supabase import create_client
from bs4 import BeautifulSoup

import re

agent_header = {'user-agent':'humphrey-come-home/0.0.1'}


res = requests.get(url, headers = agent_header)


bs = BeautifulSoup(res.content, 'html.parser')
try:
    print(bs.h1.get_text())
except AttributeError:
    print('This page is missing something! Continuing.')
 

