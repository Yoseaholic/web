export interface Track {
  title: string;
  artist: string;
  /**
   * 音频文件路径。把你的音乐文件（.mp3 / .ogg / .wav）放到 public/music/ 文件夹里，
   * 然后这里写成 "/music/文件名.mp3"。
   * 也可以直接填写网络上的音频直链（https://...）。
   */
  src: string;
  /** 可选：封面图片路径，例如 "/music/cover1.jpg"，留空则显示默认音符图标 */
  cover?: string;
}

/**
 * ============================================================
 *  🎵 如何添加你自己的音乐
 * ============================================================
 *  1. 把音乐文件（推荐 .mp3）复制到项目的  public/music/  文件夹中。
 *     （如果没有这个文件夹，新建一个即可）
 *  2. 在下面的数组里加一行，例如：
 *       { title: '歌名', artist: '歌手', src: '/music/歌名.mp3' },
 *  3. 想加封面就再加 cover: '/music/封面.jpg'
 *  4. 保存后重新构建即可，左下角播放器就能真正播放了。
 *
 *  提示：也可以用网络直链，比如：
 *       { title: 'Demo', artist: 'Someone', src: 'https://example.com/song.mp3' }
 * ============================================================
 */
export const musicTracks: Track[] = [
  {
    title: 'Time_to_love',
    artist: 'OCTOBER',
    src: '/music/Time_to_love-OCTOBER.mp3',
  },
  {
    title: 'toki',
    artist: 'hideyuki_hashimoto',
    src: '/music/toki-hideyuki_hashimoto.mp3',
  },
  {
    title: '第三个吻痕',
    artist: '林琦',
    src: '/music/第三个吻痕-林琦.mp3',
  },
  {
    title: '念',
    artist: '薛之谦',
    src: '/music/念-薛之谦.mp3',
  },
  {
    title: '谁',
    artist: '封茗囧菌',
    src: '/music/谁-封茗囧菌.mp3',
  },
  {
    title: '熄灭',
    artist: '江易泽陆卡斯',
    src: '/music/熄灭-江易泽陆卡斯.mp3',
  },
  {
    title: '循迹',
    artist: '王子健',
    src: '/music/循迹-王子健.mp3',
  },
];
