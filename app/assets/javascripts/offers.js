//$("[data-day='0']").each(function() {total = total + parseFloat($(this).data('audience'));});

var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
var calculateRates;
$(document).ready(function () {
    // Initialize jQuery datepicker
    $('.dp').datepicker();

    // After the ready event fires, watch for changes in mvpd subs
    // and OTA subs, and if they are both filled, use those values to autofill total homes
    var totalHomes = $('input#outlet_total_homes');
    var mvpdSubs = $('input#outlet_subs');
    var otaSubs = $('input#outlet_over_air');

    // Our function to get the field values, check their contents, and finally do the autofill
    var getCheckFill = function () {
        if (!mvpdSubs.val()) {
            mvpdSubs.val(0);
        }
        if (!otaSubs.val()) {
            otaSubs.val(0);
        }
        if (!!mvpdSubs.val() && !!otaSubs.val()) {
            totalHomes.val(function () {
                return parseInt(mvpdSubs.val()) + parseInt(otaSubs.val())
            });
        }
    };

    // Register event handlers
    mvpdSubs.blur(getCheckFill);
    otaSubs.blur(getCheckFill);

    // Do all our calculations here
    calculateRates = function () {
        // Check the input values at the top
        getCheckFill();

        // First, just gather information
        var currencyFactor = parseFloat($('#offer_dollar_amount').val());
        var mvpdSubscribers = parseInt($('input#outlet_subs').val() || 0);
        var otaHomes = parseInt($('input#outlet_over_air').val() || 0);
        var totalHomes = parseInt($('input#outlet_total_homes').val());

        // Get all selected cells
        var selectedCells = $('.clicked');

        // Hours
        var weeklyHours = selectedCells.length / 2;
        var monthlyHours = weeklyHours * 4;
        var yearlyHours = monthlyHours * 12;

        // Compute the weekly sub rate. This is the sum of the audience numbers of all selected cells, times the currency factor
        var weeklySubRate = 0;
        selectedCells.each(function () {
            weeklySubRate += parseFloat($(this).data('audience'));
        });
        var monthlySubRate = weeklySubRate * 4;
        var annualSubRate = weeklySubRate * 52;

        // Compute rates from Sub rates
        var weeklyRate = (annualSubRate * totalHomes) / 52;
        var monthlyRate = (annualSubRate * totalHomes) / 12;
        var annualRate = (annualSubRate * totalHomes);

        // Set the proper values for display elements and hidden elements
        $('#offer_total_hours').val(weeklyHours);

        $('#weekly_hours').text(weeklyHours);
        $('#offer_weekly_hours').val(weeklyHours);
        $('#offer_weekly_offer').val(weeklyRate);

        $('#monthly_hours').text(monthlyHours);
        $('#offer_monthly_hours').val(monthlyHours);
        $('#offer_monthly_offer').val(monthlyRate);

        $('#yearly_hours').text(yearlyHours);
        $('#offer_yearly_hours').val(yearlyHours);
        $('#offer_yearly_offer').val(annualRate);

        // Insert selected cells into holder input
        var cellHolder = $('#offer_time_cells');
        cellHolder.val('');
        $(selectedCells).each(function () {
            var day = $(this).data('day');
            var time = $(this).data('time');
            // Append something like this: "0-02:00" meaning Monday, 2:00-2:30 to the hidden field
            cellHolder.val(function (i, val) {
                return val + [day, time].join('-') + ',';
            })
        });
        console.log(cellHolder.val());
    };


    // // Populate the rate fields
    // calculateRates();
    // The 'Invert Selection' button
    $('#invert').click(function () {
        $('.cell').each(function () {
            flipSelected(this);
        });
    });
    // The 'Select All' button
    $('#selectAll').click(function () {
        $('.cell').each(function () {
            if (!$(this).hasClass('clicked')) {
                flipSelected(this);
            }
        });
    });
    // The 'Calculate' button
    $('#calculate').click(function () {
        $('.clicked').length > 0 ? calculateRates() : alert('You must select at least one cell.');
    });

    // The 'reset' button
    $('#reset').click(function () {
        $('.offerInput').each(function () {
            $(this).val('');
        });
        $('span.hours').each(function () {
            $(this).text('');
        });
        $('.cell').each(function () {
            if ($(this).hasClass('clicked')) {
                $(this).removeClass('clicked');
            }
        });
    });
    // On form submit (show offer view has no input of type submit)
    $("input[type='submit']").click(function () {
        // Make sure all our calculations are done
        // This function also updates the cell holder hidden input
        calculateRates();

    });
});