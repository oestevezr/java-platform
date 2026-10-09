import { test, expect } from '@playwright/test';
test('navigates the learning sections and interactive note', async ({page}, testInfo) => {
 await page.goto('/');
 await expect(page.getByRole('heading',{name:/El siguiente paso/})).toBeVisible();
 await page.screenshot({path:testInfo.outputPath('dashboard.png'),fullPage:true});
 await page.getByRole('link',{name:'Apuntes',exact:true}).click();
 await page.getByRole('link',{name:/Abrir apunte de muestra/}).click();
 await page.getByRole('radio',{name:'2 1',exact:true}).check();
 await page.getByRole('button',{name:'Comprobar razonamiento'}).click();
 await expect(page.getByText(/El postincremento devuelve/)).toBeVisible();
 await page.getByRole('link',{name:'Exámenes de prueba',exact:true}).click();
 await page.getByRole('button',{name:/Simulación con tiempo/}).click();
 await expect(page.getByRole('button',{name:/Simulación con tiempo/})).toHaveAttribute('aria-pressed','true');
 await expect(page.getByRole('button',{name:'Banco en preparación'})).toBeDisabled();
});
test('saves a flexible route through the local API without fabricated stats', async ({page}) => {
 await page.goto('/');
 await page.getByRole('button',{name:'Probar candidato'}).click();
 await expect(page.getByRole('button',{name:'Guardar mi ruta'})).toBeEnabled();
 await page.getByRole('radio',{name:'2 semanas'}).check();
 await page.getByRole('button',{name:'Guardar mi ruta'}).click();
 await expect(page.getByText('Ruta guardada.')).toBeVisible();
 await expect(page.getByText('14 días',{exact:true})).toBeVisible();
 await expect(page.getByRole('link',{name:'Administración',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Probar administrador'}).click();
 await page.getByRole('link',{name:'Administración',exact:true}).click();
 await expect(page.getByRole('columnheader',{name:'Seguimiento interno'})).toBeVisible();
 await expect(page.getByText('Candidato local',{exact:true})).toBeVisible();
});
test('does not overflow the viewport', async ({page}) => {
 await page.goto('/#/apuntes');
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
