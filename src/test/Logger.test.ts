import { Logger } from './../lib/Logger';
import { expect, assert } from 'chai';

describe('Logger', () => {
    describe('Creation', () => {
        it('should return a single instance', () => {
            const logger = Logger.getInstanceItem();
            expect(logger).to.be.an('object');
        })

        it('should return an error when using new()', () => {
            expect(() => new Logger()).to.throw('The Logger is a singleton class and cannot be created!');
        })
    })

    describe('InstanceName', () => {
        let logger: Logger; 
        beforeEach(() => {
            logger = Logger.getInstanceItem();
        })

        it('should be possible to set/get the name of the instance', () => {
            const name = 'TheOneAndOnlyLogger';
            logger.setInstanceName(name);
            expect(logger.getInstanceName()).to.equal(name);
        })
    })

    describe('API', () => {
        let logger: Logger;
        before(() => {
            logger = Logger.getInstanceItem();
        })

        it('should be possible to log a message with severity = info', () => {
            logger.info('this is a info message');
        })

        it('should be possible to log a message with severity = good', () => {
            logger.good('this is a good message');
        })

        it('should be possible to log a message with severity = warn', () => {
            logger.warn('this is a warn message');
        })

        it('should be possible to log a message with severity = error', () => {
            logger.error('this is a error message');
        })
    })
})
