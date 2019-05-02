(function($) {
"use strict"

//------------------------------------------------------------------------------
// Variables
//------------------------------------------------------------------------------

/**
 * The attached element ids.
 * @var selectors
 * @since 1.1.0
 */
var ids = 1

/**
 * The selector bounds to callbacks.
 * @var selectors
 * @since 0.1.0
 */
var selectors = []

//------------------------------------------------------------------------------
// Functions
//------------------------------------------------------------------------------

/**
 * Attach a callback to a selector.
 * @function attach
 * @since 0.1.0
 */
$.attach = function(selector, callback) {

	var element = {
		selector: selector,
		callback: callback
	}

	selectors.push(element)
}

/**
 * Executes all callbacks from a specific element.
 * @function attach.refresh
 * @since 0.1.0
 */
$.attach.refresh = function(root) {

	var element = $(root || document.body)

	var process = function(elements) {

		elements.each(function(i, element) {

			element = $(element)

			$.each(selectors, function(i, builder) {
				var selector = builder.selector
				var callback = builder.callback
				if (selector && callback) {
					if (element.is(selector)) {
						element.attr('data-attach-id', ids++)
						callback(i, element)
					}
				}
			})

			process(element.children())
		})
	}

	process(element)
}

/**
 * Triggers the detach listener on all attached element.
 * @function detach
 * @since 0.1.0
 */
$.detach = function(root) {

	var element = $(root || document.body)

	var process = function(elements) {

		elements.each(function(i, element) {

			element = $(element)

			if (element.is('[data-attach-id]')) {
				element.trigger('detach')
			}

			process(element.children())
		})
	}

	process(element)
}

$(document).ready(function() {
	$.attach.refresh()
})

})(jQuery);

(function($) {
"use strict"

$.attach('.cortex-modal', function(i, element) {

	//--------------------------------------------------------------------------
	// Callbacks
	//--------------------------------------------------------------------------

	/**
	 * @callback onPresent
	 * @since 0.1.0
	 */
	element.on('present', function() {
		element.toggleClass('cortex-modal-visible', true)
	})

	/**
	 * @callback onDismiss
	 * @since 0.1.0
	 */
	element.on('dismiss', function() {
		element.toggleClass('cortex-modal-visible', false)
	})

	//--------------------------------------------------------------------------
	// Events
	//--------------------------------------------------------------------------

	element.on('click', '.cortex-modal-close', function() {
		element.trigger('dismiss')
	})
})

})(jQuery);
(function ($) {

	$.attach('.cortex-admin-blocks-page', function (i, element) {

		var createBlockModal = element.find('.cortex-create-block-modal')
		var updateBlockModal = element.find('.cortex-update-block-modal')

		var onCreateBlockLinkClick = function (e) {
			e.preventDefault()
			createBlockModal.trigger('present', $(e.target).attr('href'))
		}

		var onUpdateBlockLinkClick = function (e) {
			e.preventDefault()
			updateBlockModal.trigger('present', $(e.target).attr('href'))
		}

		element.on('click', '.cortex-create-block-link', onCreateBlockLinkClick)
		element.on('click', '.cortex-update-block-link', onUpdateBlockLinkClick)

	})

	$.attach('.cortex-create-block-modal, .cortex-update-block-modal', function (i, element) {

		var content = element.find('iframe')

		//----------------------------------------------------------------------
		// Functions
		//----------------------------------------------------------------------

		/**
		 * @function present
		 * @since 0.1.0
		 * @hidden
		 */
		var present = function (src) {
			element.trigger('present', src)
		}

		/**
		 * @function dismiss
		 * @since 0.1.0
		 * @hidden
		 */
		var dismiss = function () {
			element.trigger('dismiss')
		}

		//--------------------------------------------------------------------------
		// Events
		//--------------------------------------------------------------------------

		/**
		 * @function onPresent
		 * @since 0.1.0
		 * @hidden
		 */
		var onPresent = function (e, src) {
			content.on('load', onContentLoad).attr('src', src)
			element.addClass('cortex-modal-loading')
		}

		/**
		 * @function onDismiss
		 * @since 0.1.0
		 * @hidden
		 */
		var onDismiss = function () {
			content.off('load', onContentLoad).attr('src', '')
			element.addClass('cortex-modal-loading')
		}

		/**
		 * @function onContentLoad
		 * @since 0.1.0
		 * @hidden
		 */
		var onContentLoad = function () {

			var contents = content.contents()

			var message = contents.find('#message.notice.notice-success.updated')
			if (message.length) {
				location.reload()
				dismiss()
				return
			}

			element.toggleClass('cortex-modal-loading', false)
		}

		element.on('present', onPresent)
		element.on('dismiss', onDismiss)
	})

})(jQuery);
(function ($) {

	$.attach('.cortex-admin-settings-page', function (i, element) {
	})

})(jQuery);
(function ($) {
	"use strict"

	$.attach('body.cortex-create-block-page', function (i, element) {
		element.addClass('cortex-create-block-page-ready')
	})

	$.attach('body.cortex-update-block-page', function (i, element) {
		element.addClass('cortex-update-block-page-ready')
	})

	$(document).ready(function () {

		var fields = [
			{
				mode: 'ace/mode/twig',
				editor: '#cortex-block-editor',
				textarea: '#cortex-block',
			},
			{
				mode: 'ace/mode/scss',
				editor: '#cortex-style-editor',
				textarea: '#cortex-style',
			},
			{
				mode: 'ace/mode/javascript',
				editor: '#cortex-script-editor',
				textarea: '#cortex-script',
			}
		]

		fields.forEach(function (field) {

			var element = $(field.editor)
			var textarea = $(field.textarea)

			if (element.length == 0) {
				return
			}

			/**
			 * Updates the textarea using the editor value.
			 * @function update
			 * @since 0.1.0
			 */
			var update = function () {
				textarea.val(editor.getSession().getValue())
			}

			/**
			 * Reloads the content.
			 * @function reload
			 * @since 0.1.0
			 */
			var reload = function () {

				reloading = true

				button.addClass('cortex-reload-reloading')

				$.post(ajaxurl, {

					'action': 'get_block_template_file_data',
					'id': id,
					'file': file

				}, function (code) {

					$.post(ajaxurl, {

						'action': 'get_block_template_file_date',
						'id': id,
						'file': file

					}, function (d) {

						date = d

						element.removeClass('invalid')
						editor.getSession().setValue(code)
						button.removeClass('cortex-reload-reloading')
						button.detach()

						reloading = false
					})
				})
			}

			/**
			 * Check whether the local block template file is out of sync.
			 * @function check
			 * @since 0.1.0
			 */
			var check = function () {

				$.post(ajaxurl, {

					'action': 'get_block_template_file_date',
					'id': id,
					'file': file

				}, function (d) {

					setTimeout(check, 10000)

					if (reloading) {
						return
					}

					var invalid = parseInt(d) > parseInt(date)

					if (invalid) {
						element.toggleClass('invalid', true)
						element.append(button)
					} else {
						element.toggleClass('invalid', false)
						button.detach()
					}
				})
			}

			var reloading = false

			var value = textarea.val()

			var editor = ace.edit(element.get(0))
			editor.setTheme('ace/theme/tomorrow_night')
			editor.getSession().setMode(field.mode)
			editor.getSession().setValue(value)
			editor.getSession().on('change', update)

			var file = element.attr('data-file')
			var id = element.attr('data-id')
			var date = element.attr('data-date')

			var button = $('<div class="cortex-reload"></div>')

			button.on('click', reload)

			setTimeout(check, 10000)

			update()

		})
	})

})(jQuery);