// tslint:disable-next-line:missing-jsdoc
import {IBackendService} from '../services/FirebaseService'

export interface ICloudService {
    write(refs: string, dbobject: any);
    push(refs: string, dbobject: any);
    addEventListener(refs: string, dbobject: any, cb: any);
}

export class CloudService {
/*
 const deviceDescription = {
            'deviceMetadata': {
                'id': this.name,
                'types': 'LED',
                location: 'house-east'
            },
            'properties': {
                state: false
            }
        }
*/
//this.fire.write(`devices/${this.name}`, deviceDescription)



    constructor( private backendservice: IBackendService) {
        
    };

    public register

    public write(refs: string, dbobject: any) {
        admin.database().ref(refs).set(dbobject);
    }

     public push(refs: string, dbobject: any) {
        admin.database().ref(refs).push(dbobject);
    }

    public addEventListener(refs: string, message: any, callback: (a: any) => any) {
        const listnerRef = admin.database().ref(refs);
        listnerRef.on(message, (snapshot) => {
            callback(snapshot.val());
        });
    }
}
