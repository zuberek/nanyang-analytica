The scripts require the following packages to be installed:
pandas
numpy
matplotlib
tensorflow
keras
unidecode
xml
tweepy

These should easily be installable by the command 'pip install [package_name]'.
Once everything is installed, the code can easily be run as any python
script by typing 'python crawler.py' for example.

Some files are dependent on relative file paths to the data files, so these might
have to be changed if the github repo is not cloned. Namely calc_metrics and process_pan_data.


Also note that crawler.py requires keys and tokens for the twitter API. 