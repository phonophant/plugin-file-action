import { ActionPlugin, AppData, BasePluginManager, PlayerPlugin, PluginType } from '@phonophant/shared-models';

interface FileActionTriggerData {
  trigger: {
    originPluginName: string;
    triggerId: string;
  }
  playFiles: string[];
  targetPluginName: string;
}

export default class FileAction extends ActionPlugin<void, FileActionTriggerData> {
  private pluginManager: BasePluginManager | null = null;

  init(appData: AppData) {
    this.pluginManager = appData.pluginManager;
  }

  execute(triggerData: FileActionTriggerData): void {
    const { playFiles, targetPluginName } = triggerData;
    const targetPlugin = this.pluginManager?.getPluginByName(targetPluginName);

    if (!targetPlugin) {
      throw new Error(`Target plugin with name ${targetPluginName} not found.`);
    }
    const { instance } = targetPlugin;
    
    if (!instance) {
      throw new Error(`Target plugin with name ${targetPluginName} not instantiated.`);
    }

    if (instance.pluginType !== PluginType.Player) {
      throw new Error (`Target plugin needs to be of player type. Plugin with name ${targetPluginName} is not.`);
    }

    (instance as PlayerPlugin<any>).play(playFiles[0]);
  }
}