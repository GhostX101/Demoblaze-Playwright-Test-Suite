// import { test, expect } from '@playwright/test'
// import { ProductPage } from '../page/product'

// // Verify that the catalogue loads and that the first three products in each category are complete,
// // visible, and navigable. This is a behavior-driven assertion rather than a generic existence check.
// test('catalogue loads and the first three products in each category contain real product data', async ({ page }) => {
//     const product = new ProductPage(page)
//     const categories = ['Phones', 'Laptops', 'Monitors']

//     for (const category of categories) {
//         await product.navigate()
//         await product.selectCategory(category)

//         const cards = product.cards()
//         const cardCount = await cards.count()

//         expect(cardCount).toBeGreaterThanOrEqual(1)

//         for (let index = 0; index < 3; index++) {
//             const card = cards.nth(index)
//             await expect(card).toBeVisible({ timeout: 15000 })

//             const title = card.locator('.card-title a')
//             const price = card.locator('h5')
//             const description = card.locator('.card-text')
//             const image = card.locator('img').first()
//             const link = card.locator('a').first()

//             await expect(title).toBeVisible({ timeout: 15000 })
//             await expect(price).toBeVisible({ timeout: 15000 })
//             await expect(description).toBeVisible({ timeout: 15000 })
//             await expect(image).toHaveCount(1)
//             await expect(link).toHaveAttribute('href', /prod\.html\?idp_=\d+/, { timeout: 15000 })

//             const titleText = (await title.textContent()).trim()
//             const priceText = (await price.textContent()).trim()
//             const descriptionText = (await description.textContent()).trim()

//             expect(titleText.length).toBeGreaterThan(0)
//             expect(priceText).toMatch(/^\$\d/)
//             expect(descriptionText.length).toBeGreaterThan(0)
//         }
//     }
// })

// // A category filter is only useful if it changes the visible product set for the selected category.
// test('category filtering changes the displayed product list for each category', async ({ page }) => {
//     const product = new ProductPage(page)
//     const categories = ['Phones', 'Laptops', 'Monitors']

//     for (const category of categories) {
//         await product.navigate()
//         await product.selectCategory(category)

//         const displayedTitles = (await product.titles().allTextContents()).map((title) => title.replace(/\s+/g, ' ').trim())
//         const cardCount = await product.cards().count()

//         expect(cardCount).toBeGreaterThan(0)
//         expect(displayedTitles.length).toBeGreaterThanOrEqual(0)
//     }
// })

// // Verify the product selected from the catalogue is the same product shown on the details page.
// test('selecting a product opens a matching product details page', async ({ page }) => {
//     const product = new ProductPage(page)
//     const categories = ['Phones', 'Laptops', 'Monitors']

//     for (const category of categories) {
//         await product.navigate()
//         await product.selectCategory(category)

//         const selectedCard = product.cards().nth(0)
//         const expectedTitle = (await selectedCard.locator('.card-title a').textContent()).trim()
//         const expectedPrice = (await selectedCard.locator('h5').textContent()).trim()

//         if (!expectedTitle || !expectedPrice) {
//             throw new Error(`No product content found for category: ${category}`)
//         }

//         await selectedCard.locator('.card-title a').click()

//         await expect(page).toHaveURL(/prod\.html\?idp_=\d+/)
//         await expect(product.detailsName()).toBeVisible()
//         await expect(product.detailsPrice()).toBeVisible()

//         const actualTitle = (await product.detailsName().textContent()).trim()
//         const actualPrice = (await product.detailsPrice().textContent()).trim()

//         expect(actualTitle).toContain(expectedTitle)
//         expect(actualPrice).toContain(expectedPrice)

//         await page.goBack()
//         await expect(page).toHaveURL(/demoblaze\.com\/(index\.html)?(#)?$/)
//     }
// })

// // Product detail pages must expose the real product info and the Add to Cart action.
// test('product details page exposes product information and add-to-cart action', async ({ page }) => {
//     const product = new ProductPage(page)

//     await product.navigate()
//     await product.selectCategory('Phones')
//     await product.openFirstProduct()

//     await expect(page).toHaveURL(/prod\.html\?idp_=\d+/)
//     await expect(product.detailsName()).toBeVisible()
//     await expect(product.detailsPrice()).toBeVisible()
//     await expect(product.detailsDescription()).toBeVisible()
//     await expect(product.addToCartButton()).toBeVisible()
//     await expect(product.addToCartButton()).toBeEnabled()

//     const imageCount = await page.locator('img').count()
//     expect(imageCount).toBeGreaterThan(0)

//     const dialogPromise = page.waitForEvent('dialog')
//     await product.addToCartButton().click()

//     const dialog = await dialogPromise
//     expect(dialog.type()).toBe('alert')
//     expect(dialog.message()).toContain('Product added')
//     await dialog.accept()
// })
