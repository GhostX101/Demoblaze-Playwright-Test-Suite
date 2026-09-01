import { test, expect } from '@playwright/test';
import { loginpage } from '../page/login';
import loginData from '../fixtures/login.json';

test('verify login with valid credentials', async ({ page }) => {

    const login = new loginpage(page);

    await page.goto('/');

    await login.clickonlogin();
    await expect(login.setusername1()).toBeVisible();
    await expect(login.setpassword2()).toBeVisible();
    await expect(login.clickBtn1()).toBeEnabled();

    ///actions 
    await login.setusername(loginData.validUser.username)
    await login.setpassword(loginData.validUser.password)
    await login.clickBtn();

}); 

test('verify login with valid username and invalid password', async ({page}) =>{
      const login = new loginpage(page);

    await page.goto('/');
    await login.clickonlogin();
    await login.setusername(loginData.validUser.username)
    await login.setpassword(loginData.invalidUser.password)
    await login.clickBtn();
///assert for window alert 
    const dialogPromise = page.waitForEvent('dialog');
    const dialog = await dialogPromise;
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toBe('Wrong password.');
    await dialog.accept();

})


test('verify login with invalid username and valid password', async ({page}) =>{

    const login = new loginpage(page);

    await page.goto('/');
    await login.clickonlogin();
    await login.setusername(loginData.invalidUser.username)
    await login.setpassword(loginData.validUser.password)
    await login.clickBtn();
///assert for window alert
    const dialogPromise = page.waitForEvent('dialog');
    const dialog = await dialogPromise;
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toBe('User does not exist.');
    await dialog.accept();
})



// test('verify login with blank username and password', async ({ page }) => {

//     const login = new loginpage(page);

//     await page.goto('/');
//     await login.clickonlogin();

//     const dialogPromise = page.waitForEvent('dialog');

//     await login.clickBtn();

//     const dialog = await dialogPromise;

//     expect(dialog.type()).toBe('alert');
//     expect(dialog.message()).toBe('Please fill out Username and Password.');

//     await dialog.accept();
// });