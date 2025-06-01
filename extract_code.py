import os
from pathlib import Path

def extract_code_to_markdown(src_dir, output_file):
    # Initialize markdown content
    markdown_content = ""
    
    # Walk through the directory recursively
    for root, _, files in os.walk(src_dir):
        for file in files:
            file_path = Path(root) / file
            # Get relative path from src directory
            relative_path = file_path.relative_to(src_dir)
            
            # Read file content
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Add file path and content to markdown
                markdown_content += f"{relative_path}\n```\n{content}\n```\n\n"
            except Exception as e:
                # Handle cases where file can't be read (e.g., binary files)
                markdown_content += f"{relative_path}\n```\n// Error reading file: {str(e)}\n```\n\n"
    
    # Write to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(markdown_content)

if __name__ == "__main__":
    src_directory = "src/router"
    output_file = "extracted_code.md"
    extract_code_to_markdown(src_directory, output_file)
