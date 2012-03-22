/**
 * Replacement slideDown function.
 *
 * jQuery's default function jumps around if there are any floated elements in
 * the animating element.  For some reason, it thinks the height is larger than
 * it actually is while animating.  This replacement doesn't have that problem
 * because it takes into account the real height of the element, including
 * margin and padding.
 *
 * @param {mixed} duration     How long animation will run
 * @param {string} easing      Animation easing function name
 * @param {function} callback  Called after animation is complete
 * @returns {jQuery}  Chainable
 */
$.fn.slideDown = function(duration, easing, callback)
{
	var options = $.speed(duration, easing, callback);

	return this.queue(function(next)
	{
		var element = $(this);

		if (element.is(':visible'))
		{
			// Element is already slid down
			options.complete.call(this);
			return;
		}

		// Temporarily show the element so we can correctly determine its height
		// -- this won't be visible to the user becase we're animating soon after
		element.show();

		// Get element properties that contribute to heights
		var properties = {
			height:           element.height(),
			'margin-top':     element.css('margin-top'),
			'margin-bottom':  element.css('margin-bottom'),
			'padding-top':    element.css('padding-top'),
			'padding-bottom': element.css('padding-bottom')
		};

		$.each(properties, function(key, value)
		{
			// Filter out non-numeric properties, since we cannot animate those
			if (isNaN(parseFloat(value)))
			{
				delete properties[key];
			}
		});

		// Zero each property
		for (var property in properties)
		{
			element.css(property, 0);
		}

		element.animate(properties, options.duration, options.easing, function()
		{
			// Remove inline CSS
			for (var prop in properties)
			{
				element.css(prop, '');
			}

			options.complete.call(this);
		});

		next();
	});
};
