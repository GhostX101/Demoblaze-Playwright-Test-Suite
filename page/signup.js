export class signpage {
    constructor(page) {
        this.page = page
    }

    // Opens the signup modal from the storefront navigation.
    sigupnav() {
        return this.page.locator('#signin2')
    }

    // Signup form fields and actions.
    sigupUsername() {
        return this.page.locator('#sign-username')
    }

    SignupPassword() {
        return this.page.locator('#sign-password')
    }

    signupBtn() {
        return this.page.locator('#signInModal button[onclick="register()"]')
    }

    // Modal controls used by close and visibility scenarios.
    closeBtn() {
        return this.page.locator('#signInModal button.btn-secondary')
    }

    signupModal() {
        return this.page.locator('#signInModal')
    }
}