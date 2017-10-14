'use strict';
import * as util from 'util';
import { DHT22Plugin, IPluginMode2 } from './plugins/DHT22Plugin';
import { IPluginMode, PirPlugin } from './plugins/PirPlugin';
import { ILedPluginMode, ActuatorPlugin } from './plugins/ActuatorPlugin';
import { FirebaseService, IBackendService } from './services/FirebaseService';
import { Logger } from './lib/Logger';

const fservice = new FirebaseService(
    '/home/jf/thing-dashboard-236d4-firebase-adminsdk-gj2ee-69317a74d0.json',
    'https://thing-dashboard-236d4.firebaseio.com'
);

const logger = Logger.getInstanceItem();
logger.setInstanceName('IOT-GW');

const dhtPlugin = new DHT22Plugin({ simulate: false, frequency: 10000 }, 'mydhtsensor1', 12, fservice, logger);
dhtPlugin.start();

const pirPlugin = new PirPlugin({ simulate: false, frequency: 1000 }, 'mypir1', fservice, logger);
pirPlugin.start();

const ledPlugin = new ActuatorPlugin({ simulate: false, frequency: 1000 }, 'myled1', fservice, logger);
ledPlugin.start();

//apor2