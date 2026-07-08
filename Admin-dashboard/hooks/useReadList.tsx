import { getListService } from '@/app/api/core/service';
import { Constants } from '@/app/constants';
import useSWR from 'swr';

export const useReadList = () => {
    // return useSWR(Constants.Route.service.read, () => getListService());
    return <></>;
};
