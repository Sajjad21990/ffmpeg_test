import React, { useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({
  log: true,
  corePath: "/ffmpeg_core_dist/ffmpeg-core.js",
});

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);
  const [gif, setGif] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  const combineAudioVideo = async () => {
    ffmpeg.FS(
      "writeFile",
      "test1.mp4",
      await fetchFile(
        "https://firebasestorage.googleapis.com/v0/b/bgc-video-edit.appspot.com/o/Newtest24-01-22%2F10%2Fuser_uploads%2Fbandicam%202022-04-12%2013-06-25-696.mp4?alt=media&token=14ea17e4-87f2-4f51-be51-0f9bb48fc6c7"
      )
    );
    ffmpeg.FS(
      "writeFile",
      "test2.mp4",
      await fetchFile(
        "https://firebasestorage.googleapis.com/v0/b/bgc-video-edit.appspot.com/o/Newtest24-01-22%2F10%2Fuser_uploads%2Fbandicam%202022-04-25%2015-17-06-044.mp4?alt=media&token=fdd27ea0-3e64-4aa0-bce0-fa3412d9e318"
      )
    );
    ffmpeg.FS(
      "writeFile",
      "audio.mp3",
      await fetchFile(
        "https://firebasestorage.googleapis.com/v0/b/bgc-video-edit.appspot.com/o/Newtest24-01-22%2F10%2Fuser_uploads%2Ffile_example_MP3_1MG.mp3?alt=media&token=01bf56d0-0060-4f12-8fd5-ee478e698ad3"
      )
    );

    ffmpeg.FS(
      "writeFile",
      "image.png",
      await fetchFile(
        "https://firebasestorage.googleapis.com/v0/b/bgc-video-edit.appspot.com/o/Newtest24-01-22%2F10%2Fuser_uploads%2Fid-miss%20claire.png?alt=media&token=14fbd552-daa0-463a-9a15-771457193103"
      )
    );

    await ffmpeg.run(
      "loop",
      "-framerate",
      "12",
      "-t",
      "5",
      "-i",
      "image.png",
      "-i",
      "test1.mp4",
      "loop",
      "-framerate",
      "12",
      "-t",
      "5",
      "-i",
      "image.png",
      "-filter_complex",
      "[0][1][2]concat=n=3:v=1:a=0",
      "output.mp4"
    );

    // await ffmpeg.run(
    //   "-ss",
    //   "00:00:05",
    //   "-t",
    //   "5",
    //   "-i",
    //   "test1.mp4",
    //   "-itsoffset",
    //   "00:00:02",
    //   "-t",
    //   "1",
    //   "-i",
    //   "audio.mp3",
    //   "-i",
    //   "image.png",
    //   "-map",
    //   "0:v",
    //   "-map",
    //   "1:a",
    //   "-map",
    //   "2:v",
    //   "output.mp4"
    // );

    // await ffmpeg.run(
    //   "-i",
    //   "test.mp4",
    //   "-i",
    //   "audio.mp3",
    //  "-c:v", "copy" -c:a aac -map 0:v:0 -map 1:a:0 output.mp4
    // );

    const data = ffmpeg.FS("readFile", "output.mp4");

    const url = URL.createObjectURL(new Blob([data.buffer]));

    console.log(data, url);
    setGif(url);
  };
  console.log(audio, video);
  return ready ? (
    <div className="App">
      {video && <video controls width={500} src={URL.createObjectURL(video)} />}
      {audio && (
        <audio controls>
          <source src={URL.createObjectURL(audio)} type="audio/mpeg" />
        </audio>
      )}
      {/* <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
      <input
        type="file"
        accept=".mp3"
        onChange={(e) => setAudio(e.target.files?.item(0))}
      />
      <h3>Result</h3> */}

      <button onClick={combineAudioVideo}>convert</button>
      {gif && <video controls width={500} src={gif} />}
    </div>
  ) : (
    <h1>Loading</h1>
  );
}

export default App;
