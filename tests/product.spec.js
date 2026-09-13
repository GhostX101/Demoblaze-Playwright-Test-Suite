import { test, expect } from '@playwright/test'
import { ProductPage } from '../page/product'

test.describe.configure({ mode: 'serial', timeout: 60000 })

// Verify that every product currently visible in each category contains real product data.
test('catalogue loads and visible products contain real product data', async ({ page }) => {
    const product = new ProductPage(page)
    const categories = ['Phones', 'Laptops', 'Monitors']

    for (const category of categories) {
        await product.navigate()
        await product.selectCategory(category)

        const products = await product.getVisibleProductData()

        expect(products.length).toBeGreaterThan(0)

        for (const productData of products) {
            expect(productData.title.length).toBeGreaterThan(0)
            expect(productData.price).toMatch(/^\$\d/)
            expect(productData.description.length).toBeGreaterThan(0)
            expect(productData.imageCount).toBe(1)
            expect(productData.href).toMatch(/prod\.html\?idp_=\d+/)
        }
    }
})

// Each category control must load a stable, non-empty product dataset.
test('category filtering loads products for each category', async ({ page }) => {
    const product = new ProductPage(page)
    const categories = ['Phones', 'Laptops', 'Monitors']

    for (const category of categories) {
        await product.navigate()
        await product.selectCategory(category)

        const products = await product.getVisibleProductData()

        expect(products.length).toBeGreaterThan(0)
    }
})

// Verify the product selected from the catalogue is the same product shown on the details page.
test('selecting a product opens a matching product details page', async ({ page }) => {
    const product = new ProductPage(page)
    const categories = ['Phones', 'Laptops', 'Monitors']

    for (const category of categories) {
        await product.navigate()
        await product.selectCategory(category)

        const selectedCard = product.cards().nth(0)
        const expectedTitle = (await selectedCard.locator('.card-title a').textContent()).trim()
        const expectedPrice = (await selectedCard.locator('h5').textContent()).trim()

        if (!expectedTitle || !expectedPrice) {
            throw new Error(`No product content found for category: ${category}`)
        }

        await selectedCard.locator('.card-title a').click()

        await expect(page).toHaveURL(/prod\.html\?idp_=\d+/)
        await page.waitForLoadState('domcontentloaded')
        await expect(product.detailsName()).toBeVisible()
        await expect(product.detailsPrice()).toBeVisible()

        const actualTitle = (await product.detailsName().textContent()).trim()
        const actualPrice = (await product.detailsPrice().textContent()).trim()

        expect(actualTitle).toContain(expectedTitle)
        expect(actualPrice).toContain(expectedPrice)

        await page.goBack()
        await expect(page).toHaveURL(/demoblaze\.com\/(index\.html)?(#)?$/)
    }
})

// Product detail pages must expose the real product info and the Add to Cart action.
test('product details page exposes product information and add-to-cart action', async ({ page }) => {
    const product = new ProductPage(page)

    await product.navigate()
    await product.selectCategory('Phones')
    await product.openFirstProduct()

    await expect(page).toHaveURL(/prod\.html\?idp_=\d+/)
    await page.waitForLoadState('domcontentloaded')
    await expect(product.detailsName()).toBeVisible()
    await expect(product.detailsPrice()).toBeVisible()
    await expect(product.detailsDescription()).toBeVisible()
    await expect(product.addToCartButton()).toBeVisible()
    await expect(product.addToCartButton()).toBeEnabled()

    const imageCount = await page.locator('img').count()
    expect(imageCount).toBeGreaterThan(0)

    const dialogPromise = page.waitForEvent('dialog')
    await product.addToCartButton().click()

    const dialog = await dialogPromise
    expect(dialog.type()).toBe('alert')
    expect(dialog.message()).toContain('Product added')
    await dialog.accept()
})
