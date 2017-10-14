// tslint:disable-next-line:missing-jsdoc
import * as admin from 'firebase-admin';
import * as util from 'util';
const path2json = '/home/jf/thing-dashboard-236d4-firebase-adminsdk-gj2ee-69317a74d0.json';
const serviceAccount = require(path2json);

export interface IBackendService {
    write(refs: string, dbobject: any);
    push(refs: string, dbobject: any);
    update(refs: string, dbobject: any);
    addEventListener(refs: string, dbobject: any, cb: any);
    isRegistered(refs: string):any;
}

export class FirebaseService implements IBackendService {
    private serviceAccount: string = '';

    constructor(serviceaccountkey: string, databaseurl: any) {
        //this.serviceAccount = require(serviceaccountkey);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: databaseurl
        });
    };

    public write(refs: string, dbobject: any) {
        admin.database().ref(refs).set(dbobject);
        console.log(`FB WRITE - ${refs}`)
    }

    public isRegistered(refs: string) {
        admin.database().ref(refs).once('value').then((snapshot) => {
            console.log(`snapshot val: ${util.inspect(snapshot)}`);
            return snapshot.val
        })
    }

    public push(refs: string, dbobject: any) {
        admin.database().ref(refs).push(dbobject);  
    }

    public update(refs: string, dbobject: any) {
        admin.database().ref(refs).update(dbobject);
    }

    public addEventListener(refs: string, message: any, callback: (a: any) => any) {
        const listnerRef = admin.database().ref(refs);
        listnerRef.on(message, (snapshot) => {
            callback(snapshot.val());
        });
    }
}
