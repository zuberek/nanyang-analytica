from unidecode import unidecode
from keras.models import load_model
import time
import pandas as pd
import numpy as np
import tensorflow as tf


tf.logging.set_verbosity(tf.logging.ERROR)

url = 'https://github.com/FIREF1YME/CZ4034-Information-Retrieval-Group-15/raw/master/dataset.csv'
dataset = pd.read_csv(url, encoding='utf-8')

dataset = dataset.drop(['Age Pred 1', 'Gender', 'username1', 'Age Pred 2'], axis=1)
dataset = dataset.drop(range(1000, len(dataset)))

special_chars = ' #@~'
data = dataset.drop(['username'], axis=1)
data = data.replace('http\S+|www.\S+', '~', regex=True)
data = data.replace('@\S+', '@', regex=True)
for col in data.columns:
    data[col] = data[col].apply(lambda s: str(s).lower())
    data[col] = data[col].apply(unidecode)
    data[col] = data[col].apply(lambda s: ''.join(list(map(lambda c: c if (c.isalnum() or c in special_chars) else '', s))))
data = data.replace(' +', ' ', regex=True)

char_to_idx = {'UNK': 1, 'e': 2, 't': 3, 'o': 4, 'a': 5, 'i': 6, 'n': 7, 's': 8, 'r': 9, 'l': 10, 'h': 11, 'd': 12, 'u': 13, 'm': 14, 'c': 15, 'y': 16, 'g': 17, 'w': 18, 'p': 19, 'f': 20, 'b': 21, 'k': 22, '@': 23, 'v': 24, '~': 25, '#': 26, 'j': 27, '1': 28, 'x': 29, '0': 30, '2': 31, 'z': 32, '3': 33, '4': 34, 'q': 35, '5': 36, '9': 37, '8': 38, '6': 39, '7': 40}
vocab_size = len(char_to_idx) + 1
num_of_chars = 10
num_of_words = 10
padding_char = [1] + [0] * (vocab_size - 1)
padding_word = [padding_char] * num_of_words


x_all_users = []
for i in range(len(data)): # Loop over users
    user = data.iloc[i]
    tweets = list(user.apply(lambda tweet: tweet.split(' ')))

    x = np.empty((len(tweets), num_of_words, num_of_chars, vocab_size))
        
        for j in range(len(tweets)): # Loop over tweets
            tweet = tweets[j]

for k in range(num_of_words): # Loop over words
    
    if k < len(tweet):
        word = tweet[k]
        
        for l in range(num_of_chars): # Loop over characters
            if l < len(word):
                char = word[l]
                
                one_hot = [0] * vocab_size
            if(char in char_to_idx):
                one_hot[char_to_idx[char]] = 1
            else:
                one_hot[char_to_idx['UNK']] = 1
            
                    x[j][k][l] = one_hot
                        
                        else:
                            #Pad char sequence
                            x[j][k][l] = padding_char
                                
                                else:
                                    # Pad word sequence
                                    x[j][k] = padding_word
                                        
                                        x_all_users.append(x)


gender_classifier = load_model('../models/sex.h5')
age_classifier = load_model('../models/age.h5')
ext_regressor = load_model('../models/ext.h5')
sta_regressor = load_model('../models/sta.h5')
agr_regressor = load_model('../models/agr.h5')
con_regressor = load_model('../models/con.h5')
opn_regressor = load_model('../models/opn.h5')


t0 = time.time()
genders = []
for user in x_all_users:
    y_pred = list(map(lambda y: int(round(y[0])), gender_classifier.predict(user)))
    user_prediction = max(set(y_pred), key=list(y_pred).count)
    genders.append(user_prediction)
print('Time to predict gender: ', (time.time() - t0))
dataset['Gender'] = genders
print(dataset['Gender'])


t0 = time.time()
ages = []
for user in x_all_users:
    y_pred = np.argmax(age_classifier.predict(user), axis=1)
    user_prediction = max(set(y_pred), key=list(y_pred).count)
    ages.append(user_prediction)
print('Time to predict age: ', (time.time() - t0))
dataset['Age'] = ages
print(dataset['Age'])


t0 = time.time()
ext = []
for user in x_all_users:
    y_pred = list(map(lambda y: y[0], ext_regressor.predict(user)))
    user_prediction = sum(y_pred)/len(y_pred)
    ext.append(user_prediction)
print('Time to predict extroversion: ', (time.time() - t0))
dataset['Extroversion'] = ext
print(dataset['Extroversion'])


t0 = time.time()
sta = []
for user in x_all_users:
    y_pred = list(map(lambda y: y[0], sta_regressor.predict(user)))
    user_prediction = sum(y_pred)/len(y_pred)
    sta.append(user_prediction)
print('Time to predict stability: ', (time.time() - t0))
dataset['Stability'] = sta
print(dataset['Stability'])


t0 = time.time()
agr = []
for user in x_all_users:
    y_pred = list(map(lambda y: y[0], agr_regressor.predict(user)))
    user_prediction = sum(y_pred)/len(y_pred)
    agr.append(user_prediction)
print('Time to predict agreableness: ', (time.time() - t0))
dataset['Agreeableness'] = agr
print(dataset['Agreeableness'])


t0 = time.time()
con = []
for user in x_all_users:
    y_pred = list(map(lambda y: y[0], con_regressor.predict(user)))
    user_prediction = sum(y_pred)/len(y_pred)
    con.append(user_prediction)
print('Time to predict conscientousness: ', (time.time() - t0))
dataset['Conscientousness'] = con
print(dataset['Conscientousness'])


t0 = time.time()
opn = []
for user in x_all_users:
    y_pred = list(map(lambda y: y[0], opn_regressor.predict(user)))
    user_prediction = sum(y_pred)/len(y_pred)
    opn.append(user_prediction)
print('Time to predict openness: ', (time.time() - t0))
dataset['Openness'] = opn
print(dataset['Openness'])

dataset.to_csv('dataset_with_predictions.csv', encoding='utf-8')
