import hashlib
import os
import json

def compute_file_hash(file_path):
    """Compute the SHA-256 hash of a file."""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def update_model_hashes():
    model_dir = "models"  # Adjust this to your model directory path
    model_files = ["rf_model.pkl", "xgb_model.pkl",
                   "lr_models.pkl", "knn_model.pkl"]

    hash_dict = {}
    for model_file in model_files:
        file_path = os.path.join(model_dir, model_file)
        if os.path.exists(file_path):
            hash_value = compute_file_hash(file_path)
            hash_dict[model_file] = hash_value
        else:
            print(f"Warning: File not found: {file_path}")

    # Save the updated hashes to a JSON file
    with open(os.path.join(model_dir, 'model_hashes.json'), 'w') as f:
        json.dump(hash_dict, f, indent=4)

    print("Model hashes updated successfully.")

if __name__ == "__main__":
    update_model_hashes()