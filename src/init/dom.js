/* global $ */

module.exports = () => {
    $('#splash-title').text('In the beginning, there was the grove tree...');
    setTimeout(function () {

        $('#splash-title').fadeOut(2000);
        setTimeout(function () {
            $('#splash-title').text('Its presence infused the souls of mankind with a magical essence...');
        }, 2000);
        $('#splash-title').fadeIn(2000);

        setTimeout(function () {

            $('#splash-title').fadeOut(2000);
            setTimeout(function () {
                $('#splash-title').text('There were those jealous of this extreme power...');
            }, 2000);
            $('#splash-title').fadeIn(2000);

            setTimeout(function () {

                $('#splash-title').fadeOut(2000);
                setTimeout(function () {
                    $('#splash-title').text('These tried to create a power of their own to combat those naturally infused...');
                }, 2000);
                $('#splash-title').fadeIn(2000);

                setTimeout(function () {

                    $('#splash-title').fadeOut(2000);
                    setTimeout(function () {
                        $('#splash-title').text('Eventually, they succeeded, but then...');
                    }, 2000);
                    $('#splash-title').fadeIn(2000);

                    setTimeout(function () {

                        $('#splash-title').fadeOut(2000);
                        setTimeout(function () {
                            $('#splash-title').text('Their creation consumed them, turning them into unimaginable demons...');
                        }, 2000);
                        $('#splash-title').fadeIn(2000);

                    }, 6500);

                }, 6500);

            }, 6500);

        }, 6500);

    }, 6500);
};