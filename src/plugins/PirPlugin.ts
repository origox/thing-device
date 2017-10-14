import { Gpio } from 'onoff';
import { LoggerApi } from '../lib/Logger';
import { IBackendService } from '../services/FirebaseService';

export interface IPluginMode {
    'simulate': boolean,
    'frequency': number
}

// tslint:disable-next-line:missing-jsdoc
export class PirPlugin {

    private modelValue: boolean;

    constructor(private mode: IPluginMode, private name: string, private backend: IBackendService, private logger: LoggerApi) {
        this.modelValue = false;

        const deviceDescription = {
            'deviceMetadata': {
                'id': this.name,
                'types': 'PIR',
                location: 'house-east'
            },
            'properties': {
                state: false,
                'time': new Date().toString()
            }
        }
        this.logger.info('construct pir sensor')
        this.backend.update(`devices/${this.name}`, deviceDescription)
    };

    public start(): void {
        if (this.mode.simulate) {
            this.logger.info('PIR - simulate yes');
            setInterval(() => {
                this.doSimulate();
                this.showValue();
            }, this.mode.frequency)
        } else {
            this.logger.info('PIR - simulate no');
            this.connectHardware();
        }
    }

    public stop(): void {
        //
    }

    private connectHardware() {
        const sensor = new Gpio(17, 'in', 'both');

        this.logger.info('PIR - connectHardware');

        sensor.watch((err, value) => {
            if (err) {
                this.logger.error('pir sensor read error');
                return (err);
            }
            this.logger.info('pir value: ' + value);
            this.modelValue = !!value;

            this.backend.write(
                `devices/${this.name}/properties`,
                {
                    'state': this.modelValue,
                    'time': new Date().toString()
                }
            )

            this.showValue();

        })
    }

    private doSimulate(): void {
        //do something!
    }

    private showValue(): void {
        this.logger.info(`PIR - ${this.modelValue ? 'there is someonee' : 'not anymore'}`);
    }

}