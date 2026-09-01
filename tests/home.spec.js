import{test, expect} from '@playwright/test'
import { HomePage } from '../page/Home'

test('verify homepage load to the correct url', async ({page}) =>{
    const home = new HomePage(page)
  
    await home.navigate();

    await expect(page).toHaveURL('https://www.demoblaze.com/index.html');
})

test(' homepage should display navigation', async ({page}) =>{
     const home = new HomePage(page)
     await page.goto('/');
     await expect(home.NavDisplay()).toBeVisible();
     

})