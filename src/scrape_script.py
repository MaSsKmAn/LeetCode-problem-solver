import sys
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup

def get_raw_html(site_url):
    options = Options()
    options.headless = True
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Chrome(options=options)
    try:
        driver.get(site_url)
        raw_html = driver.page_source
        driver.quit()
        return raw_html
    except Exception as e:
        driver.quit()
        return f"Error: {str(e)}"

def extract_examples(raw_html):
    soup = BeautifulSoup(raw_html, "html.parser")
    examples = []

    example_sections = soup.find_all("pre")
    for example in example_sections:
        text = example.get_text(strip=True)
        if "Input" in text and "Output" in text:
            examples.append(text)

    return examples

def main():
    if len(sys.argv) < 3:
        print("Error: No URL or save path provided.")
        return

    site_url = sys.argv[1]
    save_path = sys.argv[2]

    raw_html = get_raw_html(site_url)
    if "Error:" in raw_html:
        print(raw_html)
        return

    examples = extract_examples(raw_html)

    inputs, outputs = [], []
    for example in examples:
        for line in example.split("\n"):
            if "Input:" in line and "Output:" in line:
                input_part, output_part = line.split("Output:", 1)
                input_cleaned = input_part.replace("Input:", "").split("=")[-1].strip()
                inputs.append(input_cleaned)
                output_cleaned = output_part.split("Explanation:")[0].strip()
                outputs.append(output_cleaned)
            elif line.startswith("Input:"):
                input_cleaned = line.replace("Input:", "").split("=")[-1].strip()
                inputs.append(input_cleaned)
            elif line.startswith("Output:"):
                output_cleaned = line.replace("Output:", "").split("Explanation:")[0].strip()
                outputs.append(output_cleaned)

    os.makedirs(save_path, exist_ok=True)
    inputs_file_path = os.path.join(save_path, "inputs.txt")
    outputs_file_path = os.path.join(save_path, "outputs.txt")

    with open(inputs_file_path, "w") as f:
        for inp in inputs:
            f.write(f"{inp}\n")

    with open(outputs_file_path, "w") as f:
        for out in outputs:
            f.write(f"{out}\n")

    print(f"Inputs saved to: {inputs_file_path}")
    print(f"Outputs saved to: {outputs_file_path}")

if __name__ == "__main__":
    main()
