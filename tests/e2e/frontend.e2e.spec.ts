import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Nutrihome/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText(/Feel good about food/)
  })

  test('shows the seeded, structured about page', async ({ page }) => {
    await page.goto('http://localhost:3000/about')

    await expect(page).toHaveTitle(/About Bidisha Das/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('About Bidisha')
    await expect(page.getByRole('heading', { name: 'Clinical Dietitian Consultant' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Dietitian – Gut Health Expert', exact: true }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Dietitian', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Dietetic Intern', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Gut & digestive health' })).toBeVisible()
    await expect(page.getByText('M.Sc. Food and Nutrition')).toBeVisible()
    await expect(page.getByText('Bengali')).toBeVisible()
  })

  test('mobile navigation and layouts work on both pages', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('http://localhost:3000')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'About Bidisha' })
      .click()
    await expect(page).toHaveURL(/\/about$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
    await page.getByText('Explore areas of support').first().click()
    await expect(page.getByText('Gastritis & GERD', { exact: true })).toBeVisible()
    for (const route of ['/', '/about']) {
      await page.goto(`http://localhost:3000${route}`)
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true)
      await expect(page.getByRole('link', { name: 'Start a conversation' })).toHaveAttribute(
        'href',
        'mailto:dasbidisha228@gmail.com',
      )
    }
  })

  test('reduced motion keeps content available', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('http://localhost:3000')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(
      await page
        .locator('.portrait-flower')
        .evaluate((element) => getComputedStyle(element).animationName),
    ).toBe('none')
  })
})
