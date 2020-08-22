all: nim-omnibox-chrome-extension.zip

nim-omnibox-chrome-extension.zip:
	rm -f nim-omnibox-chrome-extension.zip
	# zsh -c "zip -r nim-omnibox-chrome-extension.zip -i *
	zip nim-omnibox-chrome-extension.zip $$(ls ./)
	

clean:
	rm *.zip