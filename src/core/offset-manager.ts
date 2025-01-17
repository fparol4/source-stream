import { OffsetHistory, OffsetManagerContext } from "../types"
import { LockManager } from './lock-manager'

/**
 * @TODO 1.The lock need`s to be tested, but I believe that it will work
 */

export class OffsetManager {
    private chunksize: number
    private offset: number = 0
    public history: OffsetHistory[] = []
    private lockManager: LockManager = new LockManager() 

    constructor(chunksize: number, context?: OffsetManagerContext) {
        this.chunksize = chunksize
        this.offset = context?.startOffset ?? this.offset 
        this.history = context?.history ?? this.history
    }

    public async addHistory(history: OffsetHistory): Promise<void> {
        this.history.push(history)
    }

    public async getCurrentOffset(): Promise<number> {
        await this.lockManager.lock()
        const currentOffset = this.offset
        this.lockManager.release()
        return currentOffset
    }

    public async getNextOffset(): Promise<number> {
        await this.lockManager.lock()
        const nextOffset = this.offset + this.chunksize 
        this.offset = nextOffset
        this.lockManager.release()
        return nextOffset
    } 
}