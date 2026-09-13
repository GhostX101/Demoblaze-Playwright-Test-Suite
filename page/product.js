import { test, expect } from '@playwright/test'

export class ProductPage {
    constructor(page) {
        this.page = page
    }

    // Navigate to the homepage and wait for the catalogue cards to render.
    async navigate() {
        await this.page.goto('https://www.demoblaze.com/index.html', { waitUntil: 'commit', timeout: 60000 })
        await this.page.waitForSelector('.card-title a', { state: 'visible', timeout: 30000 })
    }

    // Product card container used for catalogue assertions.
    cards() {
        return this.page.locator('.card:visible')
    }

    // The titles displayed on each product card.
    titles() {
        return this.page.locator('.card:visible .card-title a')
    }

    // The prices displayed on each product card.
    prices() {
        return this.page.locator('.card:visible h5')
    }

    // The short descriptions displayed on each product card.
    descriptions() {
        return this.page.locator('.card:visible .card-text')
    }

    // Product images on the card.
    images() {
        return this.page.locator('.card:visible img')
    }

    // Category links in the UI.
    category(name) {
        return this.page.locator('a').filter({ hasText: new RegExp(`^${name}$`, 'i') }).first()
    }

    // Click a category and wait for the product list to refresh.
    async selectCategory(name) {
        const categoryLink = this.category(name)
        await categoryLink.waitFor({ state: 'visible', timeout: 30000 })
        const previousProducts = await this.page.locator('.card:visible .card-title a').allTextContents()
        await categoryLink.click({ force: true })
        await this.page.waitForFunction(async (previousProducts) => {
            const getVisibleCards = () => Array.from(document.querySelectorAll('.card')).filter((card) => {
                const style = window.getComputedStyle(card)
                const bounds = card.getBoundingClientRect()
                return !card.hidden && style.display !== 'none' && style.visibility !== 'hidden' && bounds.width > 0 && bounds.height > 0
            })

            const hasCompleteCards = (cards) => cards.length > 0 && cards.every((card) => (
                card.querySelector('.card-title a') &&
                card.querySelector('h5') &&
                card.querySelector('.card-text') &&
                card.querySelector('img') &&
                card.querySelector('a[href*="prod.html?idp_"]')
            ))

            const getTitles = (cards) => cards.map((card) => card.querySelector('.card-title a')?.textContent?.trim() || '')

            const firstCards = getVisibleCards()
            if (!hasCompleteCards(firstCards) || getTitles(firstCards).join('|') === previousProducts.join('|')) return false

            await new Promise((resolve) => requestAnimationFrame(resolve))
            const secondCards = getVisibleCards()
            return secondCards.length === firstCards.length && hasCompleteCards(secondCards) && getTitles(secondCards).join('|') !== previousProducts.join('|')
        }, previousProducts, { timeout: 30000 })
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

    async getVisibleProductData() {
        return this.page.waitForFunction(() => {
            const readCards = () => Array.from(document.querySelectorAll('.card')).filter((card) => {
                const style = window.getComputedStyle(card)
                const bounds = card.getBoundingClientRect()
                return !card.hidden && style.display !== 'none' && style.visibility !== 'hidden' && bounds.width > 0 && bounds.height > 0
            }).map((card) => ({
                title: card.querySelector('.card-title a')?.textContent?.trim() || '',
                price: card.querySelector('h5')?.textContent?.trim() || '',
                description: card.querySelector('.card-text')?.textContent?.trim() || '',
                imageCount: card.querySelectorAll('img').length,
                href: card.querySelector('a')?.getAttribute('href') || ''
            }))

            const firstCards = readCards()
            if (!firstCards.length || firstCards.some((card) => !card.title || !card.price || !card.description || card.imageCount !== 1 || !/prod\.html\?idp_=\d+/.test(card.href))) {
                return false
            }

            return new Promise((resolve) => requestAnimationFrame(() => {
                const secondCards = readCards()
                resolve(secondCards.length === firstCards.length ? secondCards : false)
            }))
        }, { timeout: 30000 }).then((handle) => handle.jsonValue())
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
