FROM hypriot/rpi-node:4

# setup for TPM
RUN apt-get update
RUN apt-get install build-essential libcurl4-openssl-dev libtspi-dev openssl python tpm-tools trousers
RUN apt-get autoremove
RUN apt-get clean

RUN wget http://sourceforge.net/projects/trousers/files/OpenSSL%20TPM%20Engine/0.4.2/openssl_tpm_engine-0.4.2.tar.gz
RUN tar -xvaf openssl_tpm_engine-0.4.2.tar.gz
WORKDIR openssl_tpm_engine-0.4.2
COPY /patches/* ./
RUN patch < create_tpm_key.patch
RUN ./configure --prefix=/usr/
RUN patch < Makefile.patch
RUN make -j5
RUN make install


# node code for agent
RUN mkdir -p /app
WORKDIR /app
COPY /package.json /app
RUN npm install
COPY /src/* /app/
COPY /src/security/* /app/security/
EXPOSE 8080


CMD [ "./runAgent.sh" ]
