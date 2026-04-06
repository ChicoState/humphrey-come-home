/**
 * ImageUpload — drag-and-drop (or click) image picker with preview.
 *
 * @prop {File|null} value     — currently selected file
 * @prop {function}  onChange  — called with the selected File
 * @prop {function}  onClear   — called when the user removes the image
 * @prop {string}    [accept]  — MIME filter (default "image/*")
 * @prop {number}    [maxSize] — max file size in bytes (default 5 MB)
 */
import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import styles from "./ImageUpload.module.css";

export default function ImageUpload({
  value,
  onChange,
  onClear,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
}) {
  const [preview, setPreview] = useState(value ?? null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const validateAndProcess = useCallback(
    (file) => {
      setError(null);

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }

      if (file.size > maxSize) {
        const maxMB = Math.round(maxSize / (1024 * 1024));
        setError(`File size must be under ${maxMB}MB.`);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange?.(file);
    },
    [maxSize, onChange]
  );

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndProcess(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) validateAndProcess(file);
  };

  const handleClear = () => {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onClear?.();
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const showPreview = preview || value;

  return (
    <div className={styles.wrapper}>
      {showPreview ? (
        <div className={styles.previewContainer}>
          <img
            src={preview || value}
            alt="Upload preview"
            className={styles.preview}
          />
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ""}`}
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <div className={styles.dropzoneContent}>
            {dragActive ? (
              <ImageIcon size={32} className={styles.dropzoneIcon} />
            ) : (
              <Upload size={32} className={styles.dropzoneIcon} />
            )}
            <p className={styles.dropzoneText}>
              {dragActive
                ? "Drop image here"
                : "Drag and drop an image, or click to browse"}
            </p>
            <p className={styles.dropzoneHint}>
              Max size: {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className={styles.hiddenInput}
        aria-label="Upload image"
      />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
