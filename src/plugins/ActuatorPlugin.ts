import { Gpio } from 'onoff';
import * as util from 'util';
import { IBackendService } from '../services/FirebaseService';
import { LoggerApi } from '../lib/Logger';

export interface ILedPluginMode {
    'simulate': boolean,
    'frequency': number
}

// tslint:disable-next-line:missing-jsdoc
export class ActuatorPlugin {

    private modelValue: boolean;
    private ledState: number = 0;

    constructor(private mode: ILedPluginMode, private name: string, private backend: IBackendService, private logger: LoggerApi) {
        this.modelValue = false;

        const deviceDescription = {
            'deviceMetadata': {
                'id': this.name,
                'types': 'LED',
                location: 'house-east'
            },
            'properties': {
                state: 0,
                'time': new Date().toString()
            }
        } 

        this.backend.write(`devices/${this.name}`, deviceDescription)

        }; 

    public start(): void {
        if (this.mode.simulate) {
            this.logger.info('Actuator - simulate yes');
            setInterval(() => {
                this.doSimulate();
                this.showValue();
            }, this.mode.frequency)
        } else {
            this.logger.info('Actuator - simulate no');
            this.connectHardware();
        }
    }

    public stop(): void {
        //
    }

    private connectHardware() {
        const sensor = new Gpio(22, 'out');

        this.logger.info('LED - connectHardware');

        this.backend.addEventListener(`devices/${this.name}/properties`, 'value', (val) => {
            this.logger.info(`LED STATE: ${util.inspect(val)}`);
            sensor.writeSync(val.state);
        })

    }

    private doSimulate(): void {
        //do something!
    }

    private showValue(): void {
        //console.log(`PIR - ${this.modelValue ? 'there is someonee' : 'not anymore'}`);
    }

}