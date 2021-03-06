
  // Use MockHttpRequest in demos
  function mockXhrGenerator(file) {
    var xhr = new MockHttpRequest();
    xhr.upload = {};
    xhr.onsend = function() {
      if (xhr.upload.onloadstart) {
        xhr.upload.onloadstart();
      }
      var total = file && file.size || 1024, done = 0;
      function start() {
        setTimeout(progress, 1000);
      }
      function progress() {
        xhr.upload.onprogress({total: total, loaded: done});
        if (done < total) {
          setTimeout(progress, 200);
          done = Math.min(total, done + 254000);
        } else if (!file.abort) {
          setTimeout(finish, 1000);
        }
      }
      function finish() {
        xhr.receive(200, '{"message":"OK"}');
      }
      start();
    };
    return xhr;
  }

  window.addEventListener('WebComponentsReady', function() {
    // Monkey-patch vaadin-upload prototype to use MockHttpRequest
    Object.getPrototypeOf(document.createElement('vaadin-upload'))._createXhr = mockXhrGenerator;
  });
