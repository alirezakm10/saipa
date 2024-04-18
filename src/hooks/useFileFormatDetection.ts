// useFileFormatDetection.ts
import { useEffect, useState } from 'react';

interface FileObject {
    id: number;
    path: string;
    name: string;
    isFolder: boolean;
    downloadLink: string;
}

const useFileFormatDetection = () => {

    const detectFileFormat = (fileObject: FileObject | null) => {
        if (fileObject) {
            const fileName = fileObject.path || fileObject.name || fileObject.downloadLink;
            const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
            const fileFormatMap: Record<string, string> = {
                'jpg': 'jpg',
                'jpeg': 'jpeg',
                'png': 'png',
                'gif': 'gif',
                'bmp': 'bmp',
                'pdf': 'pdf',
                'csv': 'csv',
                'svg': 'svg',
            };

        

            return fileFormatMap[fileExtension]
        }

        return 'Unknown';
    };



    return {
        detectFileFormat,
    };
};

export default useFileFormatDetection;
