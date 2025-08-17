import requests
from bs4 import BeautifulSoup
from datetime import datetime
import pytz
import os

def get_nz_current_date():
    nz_timezone = pytz.timezone('Pacific/Auckland')
    now_nz = datetime.now(nz_timezone)
    return now_nz.strftime('%Y/%m/%d')

def generate_url(date_str):
    return f"https://www.vaticannews.va/en/word-of-the-day/{date_str}.html"

def scrape_vatican_news(url):
    response = requests.get(url)
    response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
    # Explicitly decode content as UTF-8 before passing to BeautifulSoup
    soup = BeautifulSoup(response.content.decode('utf-8'), 'html.parser')

    # Extract the liturgical indication (e.g., "Twentieth Sunday in Ordinary Time")
    liturgical_indication_tag = soup.find('div', class_='indicazioneLiturgica')
    liturgical_indication = liturgical_indication_tag.span.get_text(strip=True) if liturgical_indication_tag and liturgical_indication_tag.span else "Liturgical Indication Not Found"

    reading_content = ""
    gospel_content = ""

    sections = soup.find_all('section', class_='section--evidence')

    for section in sections:
        head_tag = section.find('div', class_='section__head')
        if head_tag and head_tag.h2:
            section_title = head_tag.h2.get_text(strip=True)
            content_wrapper = section.find('div', class_='section__content')
            
            if content_wrapper:
                section_text = ""
                for p_tag in content_wrapper.find_all('p'):
                    section_text += p_tag.get_text(separator='\n', strip=True) + "\n\n"
                
                if "Reading of the day" in section_title:
                    reading_content = f"## {section_title}\n\n{section_text}"
                elif "Gospel of the day" in section_title:
                    gospel_content = f"## {section_title}\n\n{section_text}"

    return liturgical_indication, reading_content, gospel_content

def format_to_markdown(liturgical_indication, reading_content, gospel_content):
    markdown_output = f"# {liturgical_indication}\n\n"
    markdown_output += reading_content
    markdown_output += gospel_content
    return markdown_output

def main():
    date_to_scrape = get_nz_current_date()
    # For testing with a specific date as requested in the prompt:
    # date_to_scrape = "2025/08/17" 
    
    url = generate_url(date_to_scrape)
    print(f"Scraping URL: {url}")

    try:
        liturgical_indication, reading, gospel = scrape_vatican_news(url)
        markdown_data = format_to_markdown(liturgical_indication, reading, gospel)
        
        output_dir = "public/word-of-the-day"
        os.makedirs(output_dir, exist_ok=True)
        output_filename = os.path.join(output_dir, f"word-of-the-day-{date_to_scrape.replace('/', '-')}.md")
        with open(output_filename, 'w', encoding='utf-8') as f:
            f.write(markdown_data)
        print(f"Successfully scraped and saved to {output_filename}")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
