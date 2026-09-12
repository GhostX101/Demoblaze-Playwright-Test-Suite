import { test, expect } from '@playwright/test'

export class ProductPage {
    constructor(page) {
        this.page = page
    }

    // Navigate to the homepage and wait for the catalogue cards to render.
    async navigate() {
        await this.page.goto('https://www.demoblaze.com/index.html', { waitUntil: 'domcontentloaded', timeout: 60000 })
        await this.page.waitForSelector('.card', { state: 'visible', timeout: 20000 })
    }

    // Product card container used for catalogue assertions.
    cards() {
        return this.page.locator('.card')
    }

    // The titles displayed on each product card.
    titles() {
        return this.page.locator('.card-title a')
    }

    // The prices displayed on each product card.
    prices() {
        return this.page.locator('.card h5')
    }

    // The short descriptions displayed on each product card.
    descriptions() {
        return this.page.locator('.card-text')
    }

    // Product images on the card.
    images() {
        return this.page.locator('.card img')
    }

    // Category links in the UI.
    category(name) {
        return this.page.locator('a').filter({ hasText: new RegExp(`^${name}$`, 'i') }).first()
    }

    // Click a category and wait for the product list to refresh.
    async selectCategory(name) {
        const categoryLink = this.category(name)
        await categoryLink.waitFor({ state: 'visible', timeout: 30000 })
        await categoryLink.click({ force: true })
        await this.page.waitForFunction(() => {
            const cards = Array.from(document.querySelectorAll('.card'))
            return cards.some((card) => !card.hidden && card.querySelector('.card-title a'))
        }, { timeout: 30000 })
    }

    // Return a small snapshot used to verify that the catalogue changes after filtering.
    async getVisibleProductSnapshot() {
        await this.page.waitForSelector('.card-title a', { state: 'visible', timeout: 30000 })

        const titles = await this.titles().allTextContents()
        const prices = await this.prices().allTextContents()
        const descriptions = await this.descriptions().allTextContents()

        return titles.slice(0, 3).map((title, index) => ({
            title: title.trim(),
            price: prices[index]?.trim() || '',
            description: descriptions[index]?.trim() || ''
        }))
    }

    // Open the first visible product in the catalogue.
    async openFirstProduct() {
        const firstProduct = this.titles().first()
        await firstProduct.waitFor({ state: 'visible', timeout: 30000 })
        await firstProduct.click()
    }

    // Product details page selectors. Demoblaze does not use a dedicated class for the price,
    // so we select the level 3 heading that contains the price text.
    detailsName() {
        return this.page.locator('h2').first()
    }

    detailsPrice() {
        return this.page.locator('h3').filter({ hasText: /\$/ }).first()
    }

    detailsDescription() {
        return this.page.locator('strong:has-text("Product description") + p').first()
    }

    // Link used to add the selected product to the cart.
    addToCartButton() {
        return this.page.getByRole('link', { name: /add to cart/i })
    }
}
