import { Before, After } from '@cucumber/cucumber';
import { HrmWorld } from './world';

Before({ timeout: 60000 }, async function (this: HrmWorld) {
    await this.open();
});

After(async function (this: HrmWorld) {
    await this.close();
});
