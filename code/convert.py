#!/usr/bin/env python
# Name:mels van eck
# Student number:12505757
"""
This script converts CSV files.
"""
import csv
import sys
import pandas as pd
from datetime import datetime


def get_name():

    # check for correct usage
    if len(sys.argv) != 2:
        print("Usage: python convertCSV2JSON.py filename.csv")
        sys.exit(1)

    input_csv = sys.argv[1]

    return input_csv


def read_csv(input_csv):

    # make sure it prints all columns and rows
    pd.set_option('display.max_rows', 500)
    pd.set_option('display.max_columns', 500)
    pd.set_option('display.width', 1000)

    # read the csv file with pandas
    data = pd.read_csv(input_csv, delimiter=";")
    # data = data.fillna(0)
    #
    # data['Boomkor'].replace(regex=True,
    #                         inplace=True,
    #                         to_replace=r',',
    #                         value=r'.')
    # data['Flyshoot'].replace(regex=True,
    #                          inplace=True,
    #                          to_replace=r',',
    #                          value=r'.')
    #
    # data['Garnalen'].replace(regex=True,
    #                          inplace=True,
    #                          to_replace=r',',
    #                          value=r'.')
    # data['Puls'].replace(regex=True,
    #                      inplace=True,
    #                      to_replace=r',',
    #                      value=r'.')
    # data['Sumwing'].replace(regex=True,
    #                         inplace=True,
    #                         to_replace=r',',
    #                         value=r'.')
    # data['Diversen'].replace(regex=True,
    #                          inplace=True,
    #                          to_replace=r',',
    #                          value=r'.')
    #
    # data['Boomkor'] = pd.to_numeric(data['Boomkor'], errors='coerce')
    # data['Flyshoot'] = pd.to_numeric(data['Flyshoot'], errors='coerce')
    # data['Garnalen'] = pd.to_numeric(data['Garnalen'], errors='coerce')
    # data['Puls'] = pd.to_numeric(data['Puls'], errors='coerce')

    # data['Diversen'] = pd.to_numeric(data['Diversen'], errors='coerce')
    # 
    # data['Jaar'] = pd.to_numeric(data['Jaar'], errors='coerce')
    #
    # data.set_index('Jaar',inplace=True)

    return data

def make_json(data):

    # make a json file
    data.to_json(r'Data.json', orient='index')


if __name__ == "__main__":

    make_json(read_csv(get_name()))
