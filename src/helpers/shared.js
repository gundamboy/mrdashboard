const isLocal = false;

export const getCurrentYear = () => {
    const currentDate = new Date();
    return currentDate.getFullYear();
}

export const formattedDate = (date) => {
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day +'/' + year;
}

export const fixSponsorshipDate = (date) => {
    if(typeof date === "string") {
        const dateArray = date.split("-");
        return dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0];
    } else if(typeof  date === "object") {
        return formattedDate(date.toDate());
    } else {
        return "";
    }
}

export const SCHOLARSHIP_API_PATH = () => {
    return isLocal ? "http://localhost:8888/midrivers/isomorphic-admin-dashboard/packages/isomorphic-midrivers/php/scholarship-emails.php" : "/php/scholarship-emails.php";
}

export const SPONSORSHIP_API_PATH = () => {
    return isLocal ? "http://localhost:8888/midrivers/isomorphic-admin-dashboard/packages/isomorphic-midrivers/php/sponsorship-emails.php" : "/php/sponsorship-emails.php";
}

export const REFERRALS_API_PATH = () => {
    return isLocal ? "http://localhost:8888/midrivers/isomorphic-admin-dashboard/packages/isomorphic-midrivers/php/referrals-emails.php" : "/php/referrals-emails.php";
}

export const compareByAlpha = (a, b) => {
    if (a.toLowerCase() > b.toLowerCase()) {
        return -1;
    }

    if (a.toLowerCase() < b.toLowerCase()) {
        return 1;
    }

    return 0;
}