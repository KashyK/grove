var channel = postal.channel("quests");
channel.subscribe("new quest", function (data, envelope) {
    if (data.pg > progression) {
        var sub = events.subscribe(data.how[0], function (_data, _envelope) {
            if (_envelope.topic === data.how[0]) {
                sub.unsubscribe();
                for (var key in quests) quests[key].completed = true;
                quest(questQue[progression]);
            }
        });
        $('#quests').fadeIn(400);
        $('#quest-title').text(data.name);
        setTimeout(function () {
            $('#quests').fadeOut(400);
        }, 4000);
        quests.push(data);
        progression++;
    }
});

var quest = function Quest(o) {
    if (o) {
        channel.publish("new quest", {
            name: o.name,
            description: o.desc,
            completed: false,
            pg: o.pg,
            how: o.how
        });
    }
};

var quests = [];
var questQue = [];
var progression = 0;