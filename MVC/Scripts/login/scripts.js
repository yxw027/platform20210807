
jQuery(document).ready(function () {
    /*
     * ȫ������
    */
    $.backstretch([
        "../../Scripts/login/backgrounds/1.jpg",
        "../../Scripts/login/backgrounds/2.jpg",
        "../../Scripts/login/backgrounds/3.jpg",
        "../../Scripts/login/backgrounds/4.jpg",
        "../../Scripts/login/backgrounds/5.jpg"
    ], { duration: 5000, fade: 750 });

    /*
     * ����֤
    */
    $('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });

    $('.login-form').on('submit', function (e) {

        $(this).find('input[type="text"], input[type="password"], textarea').each(function () {
            if ($(this).val() == "") {
                e.preventDefault();
                $(this).addClass('input-error');
            }
            else {
                $(this).removeClass('input-error');
            }
        });
    });
});
