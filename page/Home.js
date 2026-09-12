import { test, expect } from '@playwright/test';

export class HomePage {
    constructor(page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://www.demoblaze.com/index.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
    }

    NavDisplay() {
        return this.page.getByRole('img', { name: 'First slide' });
    }

    leftNav() {
        return this.page.locator('#carouselExampleIndicators').getByRole('button', { name: 'Previous' });
    }

    Right() {
        return this.page.locator('#carouselExampleIndicators').getByRole('button', { name: 'Next' });
    }

    Categories(){
        return this.page.getByRole('link', { name: 'CATEGORIES' })
    }

    phone(){
        return this.page.getByRole('link', { name: 'Phones' })
    }
    laptops(){
        return this.page.getByRole('link', { name: 'Laptops' })
    }

    mobile(){
        return this.page.getByRole('link', { name: 'Monitors' })
    }

    product(){
        return this.page.getByRole('link', { name: 'Monitors' })
    }


    login(){
        return this.page.getByRole('link', { name: 'Log in' })
    }
    signup(){
        return this.page.getByRole('link', { name: 'Sign up' })
    }

    cart(){
        return this.page.getByRole('link', { name: 'Cart' })
        }
    
     contact(){
        return this.page.getByRole('link', { name: 'Contact' })
    }    

    getintouch(){
        return this.page.locator('.caption').filter({ hasText: 'Get in Touch' })
    }

    footer(){
        return this.page.getByText('Copyright © Product Store')
    }
    
}