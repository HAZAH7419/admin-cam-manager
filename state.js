export class AppState {
  constructor() {
    this.flags = new Map();
    this.flags.set("enable", "true");
    this.streamerSteamIds = new Set(process.env.STREAMERS?.split(","));
  }

  isEnabled() {
    return this.flags.get("enable") !== "false";
  }

  isStreamer(id) {
    return this.streamerSteamIds.has(id);
  }

  addStreamer(id) {
    this.streamerSteamIds.add(id);
  }

  removeStreamer(id) {
    this.streamerSteamIds.delete(id);
  }
}
