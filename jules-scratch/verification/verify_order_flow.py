from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:3000")
    page.wait_for_selector("text=Start Order")
    page.click("text=Start Order")
    page.wait_for_selector("text=Add to Cart")
    page.click("text=Add to Cart")
    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
