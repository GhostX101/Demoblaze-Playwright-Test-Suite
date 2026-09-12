import { test, expect } from '@playwright/test';
import { signpage } from '../page/signup';
import signupData from '../fixtures/signup.json';

// Open a fresh modal so each scenario starts from the same storefront state.
async function openSignup(page) {
    const signup = new signpage(page);

    await page.goto('/index.html');
    await signup.sigupnav().click();
    await expect(signup.signupModal()).toBeVisible();
    return signup;
}

// Submit the form and return the browser alert text produced by Demoblaze.
async function submitSignup(signup, username, password) {
    await signup.sigupUsername().fill(username);
    await signup.SignupPassword().fill(password);

    const dialogPromise = signup.page.waitForEvent('dialog');
    await signup.signupBtn().click({ force: true });
    const dialog = await dialogPromise;
    const message = dialog.message();
    await dialog.accept();
    return message;
}

// Avoid collisions with users created by earlier runs.
function uniqueUsername(prefix = signupData.usernamePrefix) {
    return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

test('verify signup with valid credentials', async ({ page }) => {
    const signup = new signpage(page);
    const randomUsername = uniqueUsername();

    await page.goto('/index.html');
    await signup.sigupnav().click();

    await expect(signup.signupModal()).toBeVisible();
    await expect(signup.sigupUsername()).toBeVisible();
    await expect(signup.SignupPassword()).toBeVisible();
    await expect(signup.signupBtn()).toBeEnabled();

    await signup.sigupUsername().fill(randomUsername);
    await signup.SignupPassword().fill(signupData.password);

    const dialogPromise = page.waitForEvent('dialog');
    await signup.signupBtn().click({ force: true });
    const dialog = await dialogPromise;
    expect(dialog.message()).toBe('Sign up successful.');
    await dialog.accept();
});

test('sign up with empty username and password', async ({ page }) => {
    const signup = await openSignup(page);

    await signup.signupBtn().click({ force: true });
    await expect(signup.signupModal()).toBeVisible();
});

test('sign up with username only', async ({ page }) => {
    const signup = await openSignup(page);

    await signup.sigupUsername().fill(uniqueUsername());
    await signup.signupBtn().click({ force: true });
    await expect(signup.signupModal()).toBeVisible();
});

test('sign up with password only', async ({ page }) => {
    const signup = await openSignup(page);

    await signup.SignupPassword().fill(signupData.password);
    await signup.signupBtn().click({ force: true });
    await expect(signup.signupModal()).toBeVisible();
});

// These cases verify how the site handles unusual but non-empty input values.
test.describe('signup accepts non-empty username and password values', () => {
    const validCases = [
        ['special characters in username', '!user_' + Date.now(), 'Password123'],
        ['special characters in password', 'special' + Date.now(), '!@#$%^&*'],
        ['username containing spaces', 'user name ' + Date.now(), 'Password123'],
        ['password containing spaces', 'spacepass' + Date.now(), 'Pass word 123'],
        ['username containing numbers', 'user123' + Date.now(), 'Password123'],
        ['very short username', 'u' + Date.now(), 'Password123'],
        ['very short password', 'shortpass' + Date.now(), 'x'],
        ['very long username', 'u'.repeat(120) + Date.now(), 'Password123'],
        ['very long password', 'longpass' + Date.now(), 'p'.repeat(120)],
        ['uppercase and lowercase characters in username', 'UserName' + Date.now(), 'Password123'],
        ['uppercase and lowercase characters in password', 'mixedpass' + Date.now(), 'PassWord123'],
        ['username with leading and trailing spaces', '  user' + Date.now() + '  ', 'Password123'],
        ['password with leading and trailing spaces', 'trimpass' + Date.now(), '  Password123  '],
        ['only spaces in username', '   ', 'Password123'],
        ['only spaces in password', 'spaceonly' + Date.now(), '   ']
    ];

    for (const [scenario, username, password] of validCases) {
        test(`sign up with ${scenario}`, async ({ page }) => {
            const signup = await openSignup(page);
            const message = await submitSignup(signup, username, password);

            expect(['Sign up successful.', 'This user already exist.']).toContain(message);
        });
    }
});

// Reusing the exact registered username and password must not create another account.
test('sign up with an already registered username and password', async ({ page }) => {
    const username = uniqueUsername('duplicate');
    const firstSignup = await openSignup(page);
    expect(await submitSignup(firstSignup, username, signupData.password)).toBe('Sign up successful.');

    const secondSignup = await openSignup(page);
    expect(await submitSignup(secondSignup, username, signupData.password)).toBe('This user already exist.');
});

test('submit signup form multiple times', async ({ page }) => {
    const username = uniqueUsername('multiple');
    const signup = await openSignup(page);

    expect(await submitSignup(signup, username, signupData.password)).toBe('Sign up successful.');

    const duplicateSignup = await openSignup(page);
    expect(await submitSignup(duplicateSignup, username, signupData.password)).toBe('This user already exist.');
});

test('cancel and close signup modal without completing registration', async ({ page }) => {
    const signup = await openSignup(page);

    await signup.closeBtn().click();
    await expect(signup.signupModal()).toBeHidden();
});

test('signup modal displays all required fields', async ({ page }) => {
    const signup = await openSignup(page);

    await expect(signup.sigupUsername()).toBeVisible();
    await expect(signup.SignupPassword()).toBeVisible();
    await expect(signup.signupBtn()).toBeVisible();
    await expect(signup.closeBtn()).toBeVisible();
});

test('signup password field masks entered password', async ({ page }) => {
    const signup = await openSignup(page);

    await expect(signup.SignupPassword()).toHaveAttribute('type', 'password');
});

test('signup succeeds only once for a unique username', async ({ page }) => {
    const username = uniqueUsername('once');

    const firstSignup = await openSignup(page);
    expect(await submitSignup(firstSignup, username, signupData.password)).toBe('Sign up successful.');

    const secondSignup = await openSignup(page);
    expect(await submitSignup(secondSignup, username, signupData.password)).toBe('This user already exist.');
});