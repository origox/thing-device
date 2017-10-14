import * as util from 'util';
import { EventEmitter } from 'events';
// tslint:disable-next-line:no-require-imports
// tslint:disable-next-line:import-name
// tslint:disable-next-line:no-require-imports
import DHtSensor = require('node-dht-sensor');
import { LoggerApi } from '../lib/Logger';
import { IBackendService } from '../services/FirebaseService';

export interface IPluginMode2 {
    'simulate': boolean,
    'frequency': number
}

interface DeviceMetaData {
    'deviceid': string,
    'date': Date
}

interface CloudService {
    //Register device's metadata and parameters to control
    registerMetaData(devicemetadata: DeviceMetaData);
    //Listening function of parameters change from Firebase
    listenForParameterChanges();
    //Regularly send device's telemetry
    setParameter();
} 

/**
 * @class DHT22Pluginstate
 */
export class DHT22Plugin extends EventEmitter {

    private modelTemp: Number;
    private modelHum: Number;
    private modelType: Number;

    // tslint:disable-next-line:max-line-length
    constructor(private mode: IPluginMode2, private name: string, private gpio: Number, private backend: IBackendService, private logger: LoggerApi) {
        super();
        this.modelTemp = 0;
        this.modelHum = 0;
        this.modelType = 11;

        this.logger.info(`DHT constructor - mmodel: ${this.gpio}`);
        this.emit('ready');

        const deviceDescription = {
            'deviceMetadata': {
                'id': this.name,
                'types': 'TEMP/HUM',
                location: 'house-east'
            },
            'properties': {
                'temp': 0,
                'humidity': 0,
                'time': new Date().toISOString()
            }
        }

        this.logger.info('construct pir sensor')

        if(this.backend.isRegistered(`devices/${this.name}`)) {
           console.log("aapapppap");
        }


        this.backend.update(`devices/${this.name}`, deviceDescription)
    };

    public start(): void {
        if (this.mode.simulate) {
            this.logger.info('DHT - simulate yes');
            setInterval(() => {
                this.doSimulate();
                this.showValue();
            }, this.mode.frequency)
        } else {
            this.logger.info('DHT - simulate no');
            this.connectHardware();
        }
    }

    public stop(): void {
        //
    }

    private connectHardware() {
        this.logger.info(`DHT-MODEL:  ${util.inspect(this.modelType)}`);

        setInterval(() => {
            this.showValue();
        }, 60000 * 10);

        this.showValue();
    }

    private doSimulate(): void {
        //do something!
    }

    private showValue(): void {
        // tslint:disable-next-line:no-console
        console.log(`DHT - TEMP: ${this.modelTemp} HUMIDITY: ${this.modelHum}`);

        const val = DHtSensor.read(this.modelType, this.gpio, (err, temperature, humidity) => {
                if (!err) {
                    this.modelTemp = temperature;
                    this.modelHum = humidity;
                    this.logger.good('temp: ' + temperature.toFixed(3) + '°C, ' +
                        'humidity: ' + humidity.toFixed(3) + '%'
                    );

                    this.backend.write(
                        `devices/${this.name}/properties`,
                        {
                            'temp': this.modelTemp,
                            'humidity': this.modelHum,
                            'time': new Date().toString()
                        }
                    )

                    this.backend.push(
                        `devices/${this.name}/logs`,
                        {
                            'temp': this.modelTemp,
                            'humidity': this.modelHum,
                            'time': new Date().toString()
                        }
                    )
                } else {
                    this.logger.error(`error status: ${err}`);
                }
            });
    }

}