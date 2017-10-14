// tslint:disable-next-line:missing-jsdoc

enum LogLevel {
    INFO,
    GOOD,
    WARN,
    ERROR
}

export interface LoggerApi {
    //getInstanceItem(),
    setInstanceName(name: string),
    info(message: string),
    good(message: string),
    warn(message: string),
    error(message: string)
}


export class Logger implements LoggerApi{
    private static instanceItem: Logger = new Logger();
    private static logname: string = '';

    constructor() {
        if (Logger.instanceItem) {
            throw new Error('The Logger is a singleton class and cannot be created!');
        }

        Logger.instanceItem = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstanceItem() : Logger {
        return Logger.instanceItem;
    }

    public setInstanceName(name: string) {
        Logger.logname = name;
    }

     public getInstanceName(): string {
        return Logger.logname;
    }

    public info (message: string) {
        Logger.log(LogLevel.INFO, message)
    }

    public good (message: string) {
        Logger.log(LogLevel.GOOD, message)
    }

    public warn (message: string) {
        Logger.log(LogLevel.WARN, message)
    }

    public error (message: string) {
        Logger.log(LogLevel.ERROR, message)
    }

    private static log(loglevel: LogLevel, message: string) {
        // tslint:disable-next-line:no-console
        console.log(`[${Logger.logname}:${LogLevel[loglevel]}] - ${message}`);
    }
}