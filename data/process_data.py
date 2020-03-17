import numpy as np
import csv
import json

with open('Medicare_Hospital_Cost_Report_PUF_2015.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    hospital_cost_data = [row for row in reader]

from collections import defaultdict
term_count = defaultdict(lambda : 0)

# Compute total occurances for TF-IDF
for hospital in hospital_cost_data:
    name = hospital['Hospital Name']
    words = name.split()
    for word in words:
        term_count[word] += 1

# Now for each word, index on it if TF-IDF is greater than some threshold
term_to_provider = defaultdict(lambda : [])
for hospital in hospital_cost_data:
    name = hospital['Hospital Name']
    words = name.split()
    rarest_word = None
    for word in words:
        term_to_provider[word].append((int(hospital['Provider CCN']), np.log(1.0 + 1.0/len(words))*np.log(len(hospital_cost_data)/term_count[word])))

print(sorted(term_to_provider['SAN'], key=lambda v : -v[1])[:10])

# Trim to the top ten for each term
for term in term_to_provider:
    term_to_provider[term] = [i for i,score in sorted(term_to_provider[term], key=lambda v : -v[1])[:10]]


important_columns = {
        'Zip Code',
        'City',
        'State Code',
        'Hospital Name',
}

column_map = {
    'Zip Code': 'zip',
    'City': 'city',
    'State Code': 'state',
    'Hospital Name': 'name'
}

city_index = defaultdict(lambda : [])
for hospital in hospital_cost_data:
    city_index[hospital['City']].append(hospital['Provider CCN'])

hospital_lookup = {
    'term_index': term_to_provider,
    'city_index': city_index,
    'id_index': { int(h['Provider CCN']): { column_map[k]: h[k] for k in important_columns } for h in hospital_cost_data }
};

# print('\n'.join(sorted(hospital_cost_data[0].keys())))

import gzip
print(len(json.dumps(hospital_lookup)))
print(len(gzip.compress(bytes(json.dumps(hospital_lookup), 'utf-8'))))

with open('../hospital_index.js', 'w') as f:
    f.write('window.hospital_index = ' + json.dumps(hospital_lookup) + '\n')

