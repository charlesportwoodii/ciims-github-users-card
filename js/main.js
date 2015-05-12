;(function() {
	var GithubUserCard = new CardPrototype({
		
		name: "GithubUserCard",

		version: "",

		preload: function() {},
		reload: function() {
			var self = this;
			self.render();
		},
		
		render: function() {
			var self 	= this,
				user 	= self.getUsername();
		
			var span = $("<span>").addClass("fa fa-github")
								  .css("float", "left")
								  .css("border", "none")
								  .css("margin-top", "3px")
								  .text(user);
			
			$("#" + this.id + " .footer span.footer-text").html($(span));
			
			$("#" + this.id + " #card-settings-button").removeClass("fa-pulse");
			$("#" + this.id + " .configwarning").hide();
			
			$("#" + this.id + " .topcontainer").hide();
			$("#" + this.id + " .footerblock").hide();	
			
			if (self.addError() === false)
				return false;
			
			$.ajax({
				url: 'https://api.github.com/users/' + self.getUsername() + "?_=" + self.getCacheTime(), 
				type: 'GET',
				cache: true,
				dataType: 'json',
				success: function(data, textStatus, jqXHR) {
					
					// Footer display items
					$("#" + self.id + " .repos .number").text(data.public_repos);
					$("#" + self.id + " .gists .number").text(data.public_gists);
					$("#" + self.id + " .followers .number").text(data.followers);
					
					// Top Container items
					$("#" + self.id + " .author").css("background", "url(" + data.avatar_url+ ") no-repeat");
					
					// Display logic
					$("#" + self.id + " .topcontainer").show();
					$("#" + self.id + " .footerblock").show();
					
				},
				error: function(data) {
					self.addError(true);
				}
			});
			
			/*	
			*/
		},
		
		/**
		 * Retrieves the github username
		 */
		getUsername: function() {
			return CardPrototype.prototype.getProperty(this, "github_user");
		},
		
		/**
		 * Handles the error handling for the two data sources
		 */
		addError: function(force) {
			if (typeof force == "undefined")
				force = false;
				
			var self = this;
			if (force === true || self.isEmpty(self.getUsername()))
			{
				$("#" + this.id + " #card-settings-button").addClass("fa-pulse");
				$("#" + this.id + " .configwarning").show();
				return false;
			}

			return true;
		},
		
		/**
		 * Checks if a string is empty or not
		 * @param string str
		 */
		isEmpty: function(str) {
			if (str == null)
				return true;

		    return (!str || 0 === str.length);
		},
		
		/**
		 * Returns a 5 minute cache timer in unixtime
		 */
		getCacheTime: function() {
			var coeff = 1000 * 60 * 5;
			var date = new Date();  //or use any other date
			return new Date(Math.round(date.getTime() / coeff) * coeff).getTime()/1000;
		}
	});
}(this));
