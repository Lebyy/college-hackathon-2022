const humanizeDuration = require("humanize-duration");
function getData(str) {
  var startIndex = str.indexOf(" log_list = [");
  var endIndex = str.indexOf(   );
  var array = str.substring(startIndex + 12, endIndex + 12);
  const data = {};
  const messages = constrcutArray(array);
  for (var i = 0; i < messages.length; i++) {
    const messageData = messages[i];
    const logData = messageData.split(" ");
    const time = logData[0];
    const level = logData[1];
    const buildName = logData[2];
    const message = messageData.slice(
      time.length + level.length + buildName.length + 3
    );
    if (data[buildName] === undefined) {
      data[buildName] = {
        startTime: time,
        endTime: "",
        duration: 0,
        messages: [message],
      };
    } else {
      data[buildName].messages.push(message);
    }
    if (message.indexOf("Instance Deployment complete.") !== -1) {
      data[buildName].endTime = time;
      data[buildName].duration = getDuration(
        data[buildName].startTime,
        data[buildName].endTime
      );
    }
  }
  return data;
}
function constrcutArray(array) {
  var arrayList = array.split("', '");
  arrayList[0] = arrayList[0].substring(3);
  arrayList[arrayList.length - 1] = arrayList[arrayList.length - 1].substring(
    0,
    arrayList[arrayList.length - 1].length - 4
  );

  const messages = [];
  for (var i = 0; i < arrayList.length; i++) {
    var log = arrayList[i];
    messages.push(log);
  }
  return messages;
}
function getDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const duration = end.getTime() - start.getTime();
  return humanizeDuration(duration);
}
console.log(
  getData(
    `[ '2020-11-30T09:43:49Z [info] PAAS: Instance Deployment started.', '2020-11-30T09:41:10Z [info] PAAS: Success in plugin: success getting disk io info: open /proc/diskstats: no such file or directory', '2020-11-30T09:43:49Z [info] CAAS: Instance Deployment started.', '2020-11-30T09:41:34Z [info] PAAS: Deploying the new build named as Connector as a service for the antivirus service with Instance Deployment complete.' '2020-11-30T09:42:10Z [info] CAAS: Deploying disk io info: open /proc/diskstats: no such file or directory', '2020-11-30T09:43:49Z [info] CAAS: Instance Deployment started.', '2020-11-30T09:43:49Z [info] Config: Interval:10s, Quiet:false, Hostname:"localhost", Flush Interval:10s.', '2020-11-30T09:44:09Z [error] CAAS: When writing to ["http://localhost:8086"]: Post "http://localhost:8086": dial tcp 127.0.0.1:8086: connect: connection refused', '2020-11-30T09:44:10Z [warning] CAAS: Error in plugin: warning getting disk io info: open /proc/diskstats: no such file or directory', '2020-11-30T09:44:10Z [info] PAAS: Deploying disk io info: open /proc/diskstats: no such file or directory', '2020-11-30T09:45:10Z [info] CAAS: Instance Deployment configured.', '2020-11-30T09:45:10Z [warning] PAAS: Warning in plugin: error getting disk io info: open /proc/diskstats: no such file or directory.', '2020-11-30T09:45:20Z [error] PAAS: Error in plugin: error getting disk io info: open /proc/diskstats: no such file or directory', '2020-11-30T09:47:10Z [info] CAAS: Info in plugin: error getting disk io info: open /proc/diskstats: no such file or directory in Instance Deployment complete in progress', '2020-11-30T09:49:10Z [error] CAAS: Error in plugin: error getting disk io info: open /proc/diskstats: no such file or directory', '2020-11-30T09:51:10Z [info] PAAS: Error in plugin: error getting disk io info: open /proc/diskstats: no such file or directory', '2020-11-30T09:54:10Z [info] CAAS: Instance Deployment complete.', '2020-11-30T09:54:10Z [info] PAAS: Error in plugin: error getting disk io info: open /proc/diskstats: no such file or directory', '2020-11-30T09:55:10Z [info] PAAS: Error in plugin: error getting disk io info: open /proc/diskstats: no such file or directory', '2020-11-30T09:57:10Z [info] PAAS: Error in plugin: error getting disk io info: open /proc/diskstats: no such file or directory', '2020-11-30T09:54:10Z [info] PAAS: Instance Deployment complete.', ]`
  )
);
