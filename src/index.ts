// Inspired by https://github.com/actions/setup-go

import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as installer from './installer';
import * as path from 'path';

export async function run() {
  try {
    let v_version = core.getInput('v-version');

    console.log(`Setup VLang with version ${v_version}`);

    if (v_version) {
      let install_dir: string | undefined = tc.find('v', v_version);

      if (!install_dir) {
        console.log(`Vlang ${v_version} can't be found using cache, attempting to download ...`);
        install_dir = await installer.download_v(v_version);
        console.log('VLang Installed');
      }

      if (install_dir) {
        core.exportVariable('V_HOME', install_dir);
        core.addPath(path.join(install_dir, 'bin'));
        console.log('Added VLang to the path');
      } else {
        throw new Error(`Could not find a version that satisfied version spec: ${v_version}`);
      }
    }

    // add problem matchers
    const matchersPath = path.join(__dirname, '..', 'matchers.json');
    console.log(`##[add-matcher]${matchersPath}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}