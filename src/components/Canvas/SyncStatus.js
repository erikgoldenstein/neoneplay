const SyncStatus = ({ isSynced }) => {
    // let isSynced = true
    // isSynced = false
    // TODO nice switch from synced to unsynced
    return (
        <div className="ml-auto mr-6 mt-1 transition-all duration-300">
            <span className={`
            ${isSynced ? "bg-green-400" : "bg-red-400"}
            rounded-2xl p-2 text-xs font-light pr-5
            transition-all duration-1000`}>
                <span className={`relative ${isSynced ? "opacity-0 " : "opacity-100"} delay-100 transition-all duration-1000`}>un</span>
                synced
            </span>
        </div>
    )

}

export default SyncStatus;