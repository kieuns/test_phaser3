
class GunSound {
    private audioContext: AudioContext;
    private gainNode: GainNode;
    private oscillatorNode: OscillatorNode;

    constructor() {
        // AudioContext 생성
        this.audioContext = new AudioContext();
        // GainNode 생성
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        // OscillatorNode 생성
        this.oscillatorNode = this.audioContext.createOscillator();
        this.oscillatorNode.connect(this.gainNode);
    }

    public play(): void {
        const duration = 0.1; // 소리 길이 (초)
        const frequency = 880; // 주파수 (Hz)
        const attack = 0.01; // 어택 (초)
        const decay = 0.05; // 디케이 (초)
        const sustain = 0.05; // 서스테인 (초)
        const release = 0.01; // 릴리즈 (초)
        const now = this.audioContext.currentTime;

        // OscillatorNode 설정
        this.oscillatorNode.type = "sine";
        this.oscillatorNode.frequency.setValueAtTime(frequency, now);
        this.oscillatorNode.start(now);

        // GainNode 설정
        this.gainNode.gain.setValueAtTime(0, now);
        this.gainNode.gain.linearRampToValueAtTime(1, now + attack);
        this.gainNode.gain.linearRampToValueAtTime(0.5, now + attack + decay);
        this.gainNode.gain.linearRampToValueAtTime(0.2, now + attack + decay + sustain);
        this.gainNode.gain.linearRampToValueAtTime(0, now + attack + decay + sustain + release);

        // 소리 정지
        this.oscillatorNode.stop(now + duration);
    }
}

document.querySelector('button').addEventListener('click', function() {
    console.log('btn click');
    // GunSound 인스턴스 생성
    const gunSound = new GunSound();
    // 권총 소리 재생
    gunSound.play();
});

