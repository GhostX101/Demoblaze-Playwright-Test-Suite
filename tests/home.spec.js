import{test, expect} from '@playwright/test'
import { HomePage } from '../page/Home'

test('verify homepage load to the correct url', async ({page}) =>{
    const home = new HomePage(page)

    await home.navigate()

    await expect(page.url()).toContain('demoblaze')
})

test(' homepage should display navigation', async ({page}) =>{
     const home = new HomePage(page)
     await home.navigate()
     await expect(home.NavDisplay()).toBeVisible();     

})

test('homepage should display left navigation', async ({page}) =>{
    const home = new HomePage(page)
    await home.navigate()
    await expect(home.leftNav()).toBeVisible(); 
})

test('homepage should display right navigation', async ({page}) =>{ 

const home = new HomePage(page)
await home.navigate()
await expect(home.Right()).toBeVisible();
});


test('homepage should display categories', async ({page}) =>{
    const home = new HomePage(page)
    await home.navigate()
    await expect(home.Categories()).toBeVisible();
    await expect(home.phone()).toBeVisible();
    await expect(home.laptops()).toBeVisible();
    await expect(home.mobile()).toBeVisible();
    await expect(home.product()).toBeVisible();
});

test('homepage should display login and signup', async ({page}) =>{
    const home = new HomePage(page)
    await home.navigate()
    await expect(home.login()).toBeVisible();
    await expect(home.signup()).toBeVisible();
});
test('homepage should display cart & contact', async ({page}) =>{
    const home = new HomePage(page)
    await home.navigate()
    await expect(home.cart()).toBeVisible();
    await expect(home.contact()).toBeVisible();
})

test('homepage should display get in touch', async ({page}) =>{
    const home = new HomePage(page)
    await home.navigate()
    await expect(home.getintouch()).toBeVisible();
    await expect(home.getintouch()).toContainText('Address: 2390 El Camino Real');
});